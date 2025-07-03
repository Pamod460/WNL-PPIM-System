package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialPorderDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.MaterialPorder;
import lk.wnl.wijeya.entity.MaterialPorderMaterial;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
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

import java.time.LocalDate;
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
    public ResponseEntity<Map<String, String>> getLastMaterialPONumber() {
        return null;
    }

    @Override
    public ResponseEntity<StandardResponse> saveMaterialPorder(MaterialPorderDto materialPorderDto) {
        User loggeruser = userRepository.findByUsername(materialPorderDto.getLogger());
        MaterialPorder materialPoder = objectMapper.toMaterialPoder(materialPorderDto);
        materialPoder.setCreatedBy(loggeruser);
        if (materialPorderRepository.existsByPoNumber(materialPoder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Purchase Order Already Exists");
        }
        for (MaterialPorderMaterial m : materialPoder.getMaterialPorderMaterials()) m.setMaterialPorder(materialPoder);
        MaterialPorder savedMPOrder = materialPorderRepository.save(materialPoder);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Purchase Order Added Successfully", new MaterialPorderDto(savedMPOrder.getId(), savedMPOrder.getPoNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateMaterialPorder(MaterialPorderDto materialPorderDto) {
        MaterialPorder materialPorder = objectMapper.toMaterialPoder(materialPorderDto);
        MaterialPorder extMaterialPorder = materialPorderRepository.findById(materialPorder.getId()).orElseThrow(() -> new ResourceNotFoundException("Paper Not Found"));
        materialPorder.setCreatedBy(extMaterialPorder.getCreatedBy());
        if (materialPorderDto.getSmApproved() && !extMaterialPorder.getSmApproved()) {
            User manager = userRepository.findByUsername(materialPorderDto.getApprovedManagerName());
            materialPorder.setApprovedStoreManager(manager);
        }
        if (materialPorder.getAccountentApproved() && extMaterialPorder.getAccountentApproved()) {
            User accountent = userRepository.findByUsername(materialPorderDto.getApprovedAccountantName());
            materialPorder.setApprovedAccountent(accountent);
        }

        if (!extMaterialPorder.getPoNumber().equals(materialPorder.getPoNumber()) && materialPorderRepository.existsByPoNumber(materialPorder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        for (MaterialPorderMaterial m : materialPorder.getMaterialPorderMaterials())
            m.setMaterialPorder(materialPorder);

        if (materialPorderDto.getSmApproved() && !materialPorderDto.getAccountentApproved()) {
            materialPorder.setMaterialPorderStatus(materialPorderStatusRepository.findByName("PENDING_APPROVAL_ACCOUNTANT"));
        } else if (materialPorderDto.getSmApproved() && materialPorderDto.getAccountentApproved()) {
            materialPorder.setMaterialPorderStatus(materialPorderStatusRepository.findByName("APPROVED_BY_ACCOUNTANT"));
        } else if (!materialPorderDto.getSmApproved()) {
            materialPorder.setMaterialPorderStatus(materialPorderStatusRepository.findByName("PENDING_APPROVAL_MANAGER"));
        }

        MaterialPorder updatedMPOder = materialPorderRepository.save(materialPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Paper Updated Successfully",
                        new MaterialPorderDto(updatedMPOder.getId(), updatedMPOder.getPoNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteMaterialPorder(Integer id) {
        MaterialPorder materialPorder = materialPorderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
        materialPorderRepository.delete(materialPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Purchase Order Deleted Successfully", null));

    }
}
