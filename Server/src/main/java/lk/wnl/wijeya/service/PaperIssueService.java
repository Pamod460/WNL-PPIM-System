package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperIssueDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PaperIssueService {

    List<PaperIssueDto> getAll();

    List<PaperIssueDto> getAllPaperIssues(HashMap<String, String> params);



    ResponseEntity<Map<String, String>> getNextCode();

    ResponseEntity<StandardResponse> savePaperIssue(PaperIssueDto PaperIssueDto);

    ResponseEntity<StandardResponse> UpdatePaperIssue(PaperIssueDto PaperIssue);

    ResponseEntity<StandardResponse> deletePaperIssue(Integer id);
}
