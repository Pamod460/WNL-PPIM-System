package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PaperGRNRepository;
import lk.wnl.wijeya.repository.PaperPorderRepository;
import lk.wnl.wijeya.repository.PaperPorderStatusRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.security.UserService;
import lk.wnl.wijeya.service.PaperPorderService;
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
public class PaperPorderServiceIMPL implements PaperPorderService {
    private final PaperPorderRepository paperPorderRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final PaperPorderStatusRepository paperPorderStatusRepository;
    private final PaperGRNRepository paperGRNRepository;

    @Override
    public List<PaperPorderDto> getAll() {
        return objectMapper.toPaperPoderDtoList(paperPorderRepository.findAll());
    }

    @Override
    public List<PaperPorderDto> getAllPaperPorders(HashMap<String, String> params, String authHeader) {
        List<PaperPorder> paperPorders = paperPorderRepository.findAll();

        // Extract roles from token
        List<RoleDto> userRoles;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userRoles = userService.getRoles(token);

            List<String> roleNames = userRoles.stream()
                    .map(RoleDto::getName)
                    .collect(Collectors.toList());

            if (!roleNames.contains("Admin")) {
                paperPorders = paperPorders.stream()
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
            String mpstatusid = params.get("ppstatusid");

            Stream<PaperPorder> mpostream = paperPorders.stream();

            if (mpstatusid != null)
                mpostream = mpostream.filter(m -> m.getPaperPorderStatus().getId() == Integer.parseInt(mpstatusid));
            if (date != null)
                mpostream = mpostream.filter(m -> m.getDate().equals(LocalDate.parse(date)));
            if (ponumber != null)
                mpostream = mpostream.filter(m -> m.getPoNumber().equals(ponumber));

            paperPorders = mpostream.collect(Collectors.toList());
        }

        return objectMapper.toPaperPoderDtoList(paperPorders);
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = textPart.toUpperCase() + datePart + "-";

        PaperPorder lastPaperPorder = paperPorderRepository.findTopByPoNumberStartsWithOrderByPoNumberDesc(prefix);

        int nextNumber = 1;

        if (lastPaperPorder != null && lastPaperPorder.getPoNumber().length() > prefix.length()) {
            try {
                String poNumber = lastPaperPorder.getPoNumber();
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
    public ResponseEntity<StandardResponse> savePaperPorder(PaperPorderDto PaperPorderDto) {
        User loggeruser = userRepository.findByUsername(PaperPorderDto.getLogger());
        PaperPorder paperPoder = objectMapper.toPaperPoder(PaperPorderDto);
        paperPoder.setCreatedBy(loggeruser);
        if (paperPorderRepository.existsByPoNumber(paperPoder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Purchase Order Already Exists");
        }
        for (PaperPorderPaper p : paperPoder.getPaperPorderPapers()) p.setPaperPorder(paperPoder);
        PaperPorder savedMPOrder = paperPorderRepository.save(paperPoder);
        updatePaperPorderStatus(savedMPOrder.getId(), 1);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Purchase Order Added Successfully", new PaperPorderDto(savedMPOrder.getId(), savedMPOrder.getPoNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdatePaperPorder(PaperPorderDto paperPorderDto) {

        PaperPorder paperPorder = objectMapper.toPaperPoder(paperPorderDto);
        PaperPorder extPaperPorder = paperPorderRepository.findById(paperPorder.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Paper POrder Not Found"));


        paperPorder.setCreatedBy(extPaperPorder.getCreatedBy());


        final int STATUS_PENDING_SM = 1;
        final int STATUS_REJECTED_SM = 2;
        final int STATUS_APPROVED_SM = 3;
        final int STATUS_PENDING_ACC = 4;
        final int STATUS_REJECTED_ACC = 5;
        final int STATUS_APPROVED_ACC = 6;
        final int STATUS_COMPLETED = 9;

        if (paperPorderDto.getSmApproved() != null) {

            if (paperPorderDto.getSmApproved()) {

                if (extPaperPorder.getApprovedStoreManager() == null) {
                    User manager = userRepository.findByUsername(paperPorderDto.getApprovedManagerName());
                    paperPorder.setApprovedStoreManager(manager);
                    paperPorder.setSmApproved(true);
                    updatePaperPorderStatus(extPaperPorder.getId(), STATUS_APPROVED_SM);
                    updatePaperPorderStatus(extPaperPorder.getId(), STATUS_PENDING_ACC); // Move to next step
                } else {
                    paperPorder.setApprovedStoreManager(extPaperPorder.getApprovedStoreManager());
                    paperPorder.setSmApproved(true);
                }
            } else {

                updatePaperPorderStatus(extPaperPorder.getId(), STATUS_REJECTED_SM);
            }
        }


        if (paperPorderDto.getAccountentApproved() != null) {
            if (paperPorderDto.getAccountentApproved()) {

                if (extPaperPorder.getAccountentApproved()==null) {
                    User accountant = userRepository.findByUsername(paperPorderDto.getApprovedAccountantName());
                    paperPorder.setApprovedAccountent(accountant);
                    paperPorder.setAccountentApproved(true);
                    updatePaperPorderStatus(extPaperPorder.getId(), STATUS_APPROVED_ACC);
                    updatePaperPorderStatus(extPaperPorder.getId(), STATUS_COMPLETED); // Final status
                } else {
                    paperPorder.setApprovedAccountent(extPaperPorder.getApprovedAccountent());
                    paperPorder.setAccountentApproved(true);
                }
            } else {

                updatePaperPorderStatus(extPaperPorder.getId(), STATUS_REJECTED_ACC);
            }
        }


        if (!extPaperPorder.getPoNumber().equals(paperPorder.getPoNumber()) &&
                paperPorderRepository.existsByPoNumber(paperPorder.getPoNumber())) {
            throw new ResourceAlreadyExistException("PO Number Already Exists");
        }

        for (PaperPorderPaper m : paperPorder.getPaperPorderPapers()) {
            m.setPaperPorder(paperPorder);
        }


        PaperPorder updatedMPOder = paperPorderRepository.save(paperPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(
                        HttpStatus.OK.value(),
                        "Paper Purchase Order Updated Successfully",
                        new PaperPorderDto(updatedMPOder.getId(), updatedMPOder.getPoNumber())
                ));
    }

    @Override
    public ResponseEntity<StandardResponse> deletePaperPorder(Integer id) {
        PaperPorder paperPorder = paperPorderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
        paperPorderRepository.delete(paperPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Purchase Order Deleted Successfully", null));

    }

    @Override
    public void updatePaperPorderStatus(Integer paperPOrderId, Integer statusId) {

        PaperPorder paperPorder = paperPorderRepository.findById(paperPOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper POrder not found"));

        PaperPorderStatus status = paperPorderStatusRepository.findById(statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        paperPorder.setPaperPorderStatus(status);
        paperPorderRepository.save(paperPorder);

    }


    @Override
    public void updatePorderReceivingStatus(Integer porderId) {
        PaperPorder porder = paperPorderRepository.findById(porderId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));

        List<PaperPorderPaper> orderedPapers = new ArrayList<>(porder.getPaperPorderPapers());


        boolean allReceived = true;
        boolean anyReceived = false;

        for (PaperPorderPaper pom : orderedPapers) {
            BigDecimal orderedQty = BigDecimal.valueOf(pom.getQuentity());
            BigDecimal receivedQty = paperGRNRepository.sumReceivedQtyByPorderAndPaper(porderId, pom.getPaper().getId());

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
            updatePaperPorderStatus(porderId, 8); // Fully Received
        } else if (anyReceived) {
            updatePaperPorderStatus(porderId, 7); // 7 = Partially Received
        } else {
            updatePaperPorderStatus(porderId, 1); // 1 = Ordered
        }
    }
}
