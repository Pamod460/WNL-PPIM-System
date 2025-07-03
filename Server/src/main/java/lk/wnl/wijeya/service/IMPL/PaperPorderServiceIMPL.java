package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.PaperPorder;
import lk.wnl.wijeya.entity.PaperPorderPaper;
import lk.wnl.wijeya.entity.PaperPorder;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PaperPorderRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.security.UserService;
import lk.wnl.wijeya.service.PaperPorderService;
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
public class PaperPorderServiceIMPL implements PaperPorderService {
    private final PaperPorderRepository paperPorderRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;

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
            String mpstatusid = params.get("mpstatusid");

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
    public ResponseEntity<Map<String, String>> getLastPaperPONumber() {
        return null;
    }

    @Override
    public ResponseEntity<StandardResponse> savePaperPorder(PaperPorderDto PaperPorderDto) {
        User loggeruser = userRepository.findByUsername(PaperPorderDto.getLogger());
        PaperPorder paperPoder = objectMapper.toPaperPoder(PaperPorderDto);
        paperPoder.setCreatedBy(loggeruser);
        if (paperPorderRepository.existsByPoNumber(paperPoder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Purchase Order Already Exists");
        }
        PaperPorder savedMPOrder = paperPorderRepository.save(paperPoder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Purchase Order Added Successfully", new PaperPorderDto(savedMPOrder.getId(), savedMPOrder.getPoNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdatePaperPorder(PaperPorderDto paperPorderDto) {
        PaperPorder paperPorder = objectMapper.toPaperPoder(paperPorderDto);
        PaperPorder extPaperPorder = paperPorderRepository.findById(paperPorder.getId()).orElseThrow(() -> new ResourceNotFoundException("Paper Not Found"));
        paperPorder.setCreatedBy(extPaperPorder.getCreatedBy());
        if (paperPorderDto.getSmApproved() && !extPaperPorder.getSmApproved()) {
            User manager = userRepository.findByUsername(paperPorderDto.getApprovedManagerName());
            paperPorder.setApprovedStoreManager(manager);
        }
        if (paperPorder.getAccountentApproved() && extPaperPorder.getAccountentApproved()) {
            User accountent = userRepository.findByUsername(paperPorderDto.getApprovedAccountantName());
            paperPorder.setApprovedAccountent(accountent);
        }

        if (!extPaperPorder.getPoNumber().equals(paperPorder.getPoNumber()) && paperPorderRepository.existsByPoNumber(paperPorder.getPoNumber())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        for (PaperPorderPaper m : paperPorder.getPaperPorderPapers())
            m.setPaperPorder(paperPorder);

        if (paperPorderDto.getSmApproved() && !paperPorderDto.getAccountentApproved()) {
            paperPorder.setPaperPorderStatus(paperPorderRepository.findByName("PENDING_APPROVAL_ACCOUNTANT"));
        } else if (paperPorderDto.getSmApproved() && paperPorderDto.getAccountentApproved()) {
            paperPorder.setPaperPorderStatus(paperPorderRepository.findByName("APPROVED_BY_ACCOUNTANT"));
        } else if (!paperPorderDto.getSmApproved()) {
            paperPorder.setPaperPorderStatus(paperPorderRepository.findByName("PENDING_APPROVAL_MANAGER"));
        }

        PaperPorder updatedMPOder = paperPorderRepository.save(paperPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Paper Updated Successfully",
                        new PaperPorderDto(updatedMPOder.getId(), updatedMPOder.getPoNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> deletePaperPorder(Integer id) {
        PaperPorder paperPorder  = paperPorderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
        paperPorderRepository.delete(paperPorder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Purchase Order Deleted Successfully", null));

    }
}
