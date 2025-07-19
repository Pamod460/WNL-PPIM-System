package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperIssueDto;
import lk.wnl.wijeya.entity.IssuedPaper;
import lk.wnl.wijeya.entity.PaperIssue;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PaperIssueRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.PaperIssueService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PaperIssueServiceIMPL implements PaperIssueService {
    private final PaperIssueRepository paperIssueRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<PaperIssueDto> getAll() {
        return objectMapper.toPaperIssueDtoList(paperIssueRepository.findAll());
    }

    @Override
    public List<PaperIssueDto> getAllPaperIssues(HashMap<String, String> params) {
        List<PaperIssue> PaperIssues = this.paperIssueRepository.findAll();

        if (params.isEmpty()) return objectMapper.toPaperIssueDtoList(PaperIssues);

        Stream<PaperIssue> stream = PaperIssues.stream();

        String number = params.get("number");
        String issuedDate = params.get("issuedDate");
//            String fullname = params.get("fullname");

        if (number != null) stream = stream.filter(a -> a.getCode().equalsIgnoreCase(number));
        if (issuedDate != null) stream = stream.filter(a -> a.getIssuedDate().equals(LocalTime.parse(issuedDate)));
//            if (fullname != null) stream = stream.filter(a -> a.getFullName().toLowerCase().contains(fullname.toLowerCase()));

        return objectMapper.toPaperIssueDtoList(stream.collect(Collectors.toList()));

    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode() {
        PaperIssue lastOrder = paperIssueRepository.findTopByOrderByIdDesc();

        int nextNumber = (lastOrder != null) ? lastOrder.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode = String.format("MIS-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<StandardResponse> savePaperIssue(PaperIssueDto PaperIssueDto) {
        PaperIssue paperIssue = objectMapper.toPaperIssue(PaperIssueDto);
        paperIssue.setCreatedBy(userRepository.findByUsername(PaperIssueDto.getLogger()));
        if (paperIssueRepository.existsByCode(paperIssue.getCode())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }

        for (IssuedPaper issuedPaper : paperIssue.getIssuedPapers()) {
            issuedPaper.setPaperIssue(paperIssue);
        }
        PaperIssue savedPaperIssue = paperIssueRepository.save(paperIssue);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "PaperIssue Added Successfully",
                        new PaperIssueDto(savedPaperIssue.getId(), savedPaperIssue.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdatePaperIssue(PaperIssueDto PaperIssueDto) {
        PaperIssue paperIssue = objectMapper.toPaperIssue(PaperIssueDto);
        PaperIssue extPaperIssue = paperIssueRepository.findById(paperIssue.getId()).orElseThrow(() -> new ResourceNotFoundException("PaperIssue not found"));
        paperIssue.setCreatedBy(extPaperIssue.getCreatedBy());
        if (paperIssueRepository.existsByCodeAndIdNot(paperIssue.getCode(), paperIssue.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }

        for (IssuedPaper issuedPaper : paperIssue.getIssuedPapers()) {
            issuedPaper.setPaperIssue(paperIssue);
        }
        PaperIssue savedPaperIssue = paperIssueRepository.save(paperIssue);
        return ResponseEntity.ok(new StandardResponse(200, "PaperIssue Updated Successfully", new PaperIssueDto(savedPaperIssue.getId(), savedPaperIssue.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> deletePaperIssue(Integer id) {
        PaperIssue PaperIssue = paperIssueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PaperIssue Not Found"));

        paperIssueRepository.delete(PaperIssue);
        return new ResponseEntity<>(new StandardResponse(200, "PaperIssue Deleted Successfully", null), HttpStatus.OK);
    }
}
