package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialPorderDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.MaterialPorder;
import lk.wnl.wijeya.entity.MaterialPorderMaterial;
import lk.wnl.wijeya.entity.MaterialPorderStatus;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialGRNRepository;
import lk.wnl.wijeya.repository.MaterialPorderRepository;
import lk.wnl.wijeya.repository.MaterialPorderStatusRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.security.UserService;
import lk.wnl.wijeya.service.MaterialPorderService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MaterialPorderServiceIMPL implements MaterialPorderService {
    private final MaterialPorderRepository materialPorderRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final MaterialPorderStatusRepository materialPorderStatusRepository;
    private final MaterialGRNRepository materialGRNRepository;

    @Override
    public List<MaterialPorderDto> getAll() {
        return objectMapper.toMaterialPoderDtoList(materialPorderRepository.findAll());
    }

    @Override
    public List<MaterialPorderDto> getAllMaterialPorders(HashMap<String, String> params, String authHeader) {
        List<MaterialPorder> materialPorders = materialPorderRepository.findAll();

        // Extract roles from token
        List<RoleDto> userRoles;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userRoles = userService.getRoles(token);

            List<String> roleNames = userRoles.stream()
                    .map(RoleDto::getName)
                    .collect(Collectors.toList());

            if (!roleNames.contains("Admin")) {
                materialPorders = materialPorders.stream()
                        .filter(p -> {
                            boolean smApproved = p.getSmApproved();
                            boolean accountantApproved = p.getAccountentApproved();

                            if (roleNames.contains("Store Manager") || roleNames.contains("Store Keeper")) {
                                return !smApproved; // Show if not yet approved by SM
                            } else if (roleNames.contains("Accountant")) {
                                return smApproved && !accountantApproved;
                            }

                            return false;
                        })
                        .collect(Collectors.toList());
            }

        }


        // 🧠 Apply Param Filters (optional)
        if (!params.isEmpty()) {
            String ponumber = params.get("ponumber");
            String date = params.get("date");
            String mpstatusid = params.get("mpstatusid");

            Stream<MaterialPorder> mpostream = materialPorders.stream();

            if (mpstatusid != null)
                mpostream = mpostream.filter(m -> m.getMaterialPorderStatus().getId() == Integer.parseInt(mpstatusid));
            if (date != null)
                mpostream = mpostream.filter(m -> m.getDate().equals(LocalDate.parse(date)));
            if (ponumber != null)
                mpostream = mpostream.filter(m -> m.getPoNumber().equals(ponumber));

            materialPorders = mpostream.collect(Collectors.toList());
        }

        return objectMapper.toMaterialPoderDtoList(materialPorders);
    }


    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = textPart.toUpperCase() + datePart + "-";

        MaterialPorder lastMaterialPorder = materialPorderRepository.findTopByPoNumberStartsWithOrderByPoNumberDesc(prefix);

        int nextNumber = 1;

        if (lastMaterialPorder != null && lastMaterialPorder.getPoNumber().length() > prefix.length()) {
            try {
                String poNumber = lastMaterialPorder.getPoNumber();
                String numberPart = poNumber.substring(prefix.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                // fallback to 1
                nextNumber = 1;
            }
        }

        String nextCode = String.format("%s%03d", prefix, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);

        return ResponseEntity.ok(result);
    }


    @Override
    public ResponseEntity<StandardResponse> saveMaterialPorder(MaterialPorderDto materialPorderDto) {

        User loggerUser = userRepository.findByUsername(materialPorderDto.getLogger());
        if (loggerUser == null) {
            throw new ResourceNotFoundException("User not found: " + materialPorderDto.getLogger());
        }


        MaterialPorder materialPorder = objectMapper.toMaterialPoder(materialPorderDto);
        materialPorder.setCreatedBy(loggerUser);

        if (materialPorderRepository.existsByPoNumber(materialPorder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Purchase Order Already Exists");
        }

        for (MaterialPorderMaterial material : materialPorder.getMaterialPorderMaterials()) {
            material.setMaterialPorder(materialPorder);
        }

        MaterialPorder savedOrder = materialPorderRepository.save(materialPorder);

        final int STATUS_PENDING_SM = 1;
        updateMaterialPorderStatus(savedOrder.getId(), STATUS_PENDING_SM);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(
                        "Purchase Order Added Successfully",
                        new MaterialPorderDto(savedOrder.getId(), savedOrder.getPoNumber())
                ));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateMaterialPorder(MaterialPorderDto materialPorderDto) {

        MaterialPorder materialPorder = objectMapper.toMaterialPoder(materialPorderDto);
        MaterialPorder extMaterialPorder = materialPorderRepository.findById(materialPorder.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material POrder Not Found"));


        materialPorder.setCreatedBy(extMaterialPorder.getCreatedBy());


        final int STATUS_PENDING_SM = 1;
        final int STATUS_REJECTED_SM = 2;
        final int STATUS_APPROVED_SM = 3;
        final int STATUS_PENDING_ACC = 4;
        final int STATUS_REJECTED_ACC = 5;
        final int STATUS_APPROVED_ACC = 6;
        final int STATUS_COMPLETED = 9;

        if (materialPorderDto.getSmApproved() != null) {

            if (materialPorderDto.getSmApproved()) {

                if (extMaterialPorder.getApprovedStoreManager() == null) {
                    User manager = userRepository.findByUsername(materialPorderDto.getApprovedManagerName());
                    materialPorder.setApprovedStoreManager(manager);
                    materialPorder.setSmApproved(true);
                    updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_APPROVED_SM);
                    updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_PENDING_ACC); // Move to next step
                } else {
                    materialPorder.setApprovedStoreManager(extMaterialPorder.getApprovedStoreManager());
                    materialPorder.setSmApproved(true);
                }
            } else {

                updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_REJECTED_SM);
            }
        }


        if (materialPorderDto.getAccountentApproved() != null) {
            if (materialPorderDto.getAccountentApproved()) {

                if (extMaterialPorder.getAccountentApproved()==null) {
                    User accountant = userRepository.findByUsername(materialPorderDto.getApprovedAccountantName());
                    materialPorder.setApprovedAccountent(accountant);
                    materialPorder.setAccountentApproved(true);
                    updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_APPROVED_ACC);
                    updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_COMPLETED); // Final status
                } else {
                    materialPorder.setApprovedAccountent(extMaterialPorder.getApprovedAccountent());
                    materialPorder.setAccountentApproved(true);
                }
            } else {

                updateMaterialPorderStatus(extMaterialPorder.getId(), STATUS_REJECTED_ACC);
            }
        }


        if (!extMaterialPorder.getPoNumber().equals(materialPorder.getPoNumber()) &&
                materialPorderRepository.existsByPoNumber(materialPorder.getPoNumber())) {
            throw new ResourceAlreadyExistException("PO Number Already Exists");
        }

        for (MaterialPorderMaterial m : materialPorder.getMaterialPorderMaterials()) {
            m.setMaterialPorder(materialPorder);
        }


        MaterialPorder updatedMPOder = materialPorderRepository.save(materialPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(
                        HttpStatus.OK.value(),
                        "Material Purchase Order Updated Successfully",
                        new MaterialPorderDto(updatedMPOder.getId(), updatedMPOder.getPoNumber())
                ));
    }


    @Override
    public ResponseEntity<StandardResponse> deleteMaterialPorder(Integer id) {
        MaterialPorder materialPorder = materialPorderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
        materialPorderRepository.delete(materialPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Purchase Order Deleted Successfully", null));

    }


    @Override
    public void updateMaterialPorderStatus(Integer materialPorderId, Integer statusId) {

        MaterialPorder materialPorder = materialPorderRepository.findById(materialPorderId)
                .orElseThrow(() -> new ResourceNotFoundException("Material POrder not found"));

        MaterialPorderStatus status = materialPorderStatusRepository.findById(statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        materialPorder.setMaterialPorderStatus(status);
        materialPorderRepository.save(materialPorder);

    }
    @Override
    public void updatePorderReceivingStatus(Integer porderId) {
        MaterialPorder porder = materialPorderRepository.findById(porderId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));

        List<MaterialPorderMaterial> orderedMaterials = new ArrayList<>(porder.getMaterialPorderMaterials());


        boolean allReceived = true;
        boolean anyReceived = false;

        for (MaterialPorderMaterial pom : orderedMaterials) {
            BigDecimal orderedQty = BigDecimal.valueOf(pom.getQuantity());
            BigDecimal receivedQty = materialGRNRepository.sumReceivedQtyByPorderAndMaterial(porderId, pom.getMaterial().getId());

            if (receivedQty == null || receivedQty.compareTo(BigDecimal.ZERO) == 0) {
                allReceived = false;
            } else if (receivedQty.compareTo(orderedQty) < 0) {
                allReceived = false;
                anyReceived = true;
            } else if (receivedQty.compareTo(orderedQty) >= 0) {
                anyReceived = true;
            }
        }

        if (allReceived) {
            updateMaterialPorderStatus(porderId, 8); // Fully Received
        } else if (anyReceived) {
            updateMaterialPorderStatus(porderId, 7); // 7 = Partially Received
        } else {
            updateMaterialPorderStatus(porderId, 1); // 1 = Ordered
        }
    }

}
