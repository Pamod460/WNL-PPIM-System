package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperGrnDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.entity.PaperGrn;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PaperGRNRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.PaperGRNService;
import lk.wnl.wijeya.service.PaperService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PaperGRNServiceIMPL implements PaperGRNService {
    private final PaperGRNRepository paperGRNRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
private final PaperService paperService;

    @Override
    public List<PaperGrnDto> getAll() {
        return objectMapper.toPaperGrnDtoList(paperGRNRepository.findAll());}

    @Override
    public List<PaperGrnDto> getAllPaperGrns(HashMap<String, String> params, String authHeader) {
        List<PaperGrn> paperGrns = paperGRNRepository.findAll();


        if (!params.isEmpty()) {
            String ponumber = params.get("ponumber");
            String date = params.get("date");
            String mpstatusid = params.get("mgrnstatusid");

            Stream<PaperGrn> mpostream = paperGrns.stream();

            if (mpstatusid != null)
                mpostream = mpostream.filter(m -> m.getPaperGrnStatus().getId() == Integer.parseInt(mpstatusid));
            if (date != null)
                mpostream = mpostream.filter(m -> m.getDate().equals(LocalDate.parse(date)));
            if (ponumber != null)
                mpostream = mpostream.filter(m -> m.getCode().equals(ponumber));

            paperGrns = mpostream.collect(Collectors.toList());
        }

        return objectMapper.toPaperGrnDtoList(paperGrns);

    }




    @Override
    public ResponseEntity<StandardResponse> savePaperGrn(PaperGrnDto paperGrnDto) {
        User loggeruser = userRepository.findByUsername(paperGrnDto.getLogger());
        PaperGrn paperPoder = objectMapper.toPaperGrn(paperGrnDto);
        paperPoder.setCreatedBy(loggeruser);
        if (paperGRNRepository.existsByCode(paperPoder.getCode())) {
            throw new ResourceAlreadyExistException("Purchase Order Already Exists");
        }
        for (PaperGrnPaper m : paperPoder.getPaperGrnPapers()) {m.setPaperGrn(paperPoder);
        paperService.increaseQuantity(m.getPaper().getId(), BigDecimal.valueOf(m.getQuantity()));
        };
        PaperGrn savedMGrn = paperGRNRepository.save(paperPoder);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Purchase Order Added Successfully", new PaperGrnDto(savedMGrn.getId(), savedMGrn.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdatePaperGrn(PaperGrnDto paperGrnDto) {
        PaperGrn paperGrn = objectMapper.toPaperGrn(paperGrnDto);
        PaperGrn extPaperGrn = paperGRNRepository.findById(paperGrn.getId()).orElseThrow(() -> new ResourceNotFoundException("Paper Not Found"));
        paperGrn.setCreatedBy(extPaperGrn.getCreatedBy());


        if (!extPaperGrn.getCode().equals(paperGrn.getCode()) && paperGRNRepository.existsByCode(paperGrn.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        for (PaperGrnPaper m : paperGrn.getPaperGrnPapers())
            m.setPaperGrn(paperGrn);



        PaperGrn updatedMPOder = paperGRNRepository.save(paperGrn);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Paper Updated Successfully",
                        new PaperGrnDto(updatedMPOder.getId(), updatedMPOder.getCode())));


    }

    @Override
    public ResponseEntity<StandardResponse> deletePaperGrn(Integer id) {
        PaperGrn paperGrn = paperGRNRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
        paperGRNRepository.delete(paperGrn);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Purchase Order Deleted Successfully", null));


    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String codePrefix = textPart.toUpperCase() + datePart + "-";
        PaperGrn paperGrn = paperGRNRepository.findTopByCodeStartsWithOrderByCodeDesc(codePrefix);

        int nextNumber = 1;
        if (paperGrn != null && paperGrn.getCode().length() > codePrefix.length()) {
            try {
                String numberPart = paperGrn.getCode().substring(codePrefix.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }
        String nextCode = codePrefix + String.format("%02d", nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }
}
