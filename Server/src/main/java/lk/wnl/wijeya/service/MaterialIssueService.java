package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialIssueDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MaterialIssueService {

    List<MaterialIssueDto> getAll();

    List<MaterialIssueDto> getAllMaterialIssues(HashMap<String, String> params);

    ResponseEntity<Map<String, String>> getNextCode();

    ResponseEntity<StandardResponse> saveMaterialIssue(MaterialIssueDto MaterialIssueDto);

    ResponseEntity<StandardResponse> UpdateMaterialIssue(MaterialIssueDto MaterialIssue);

    ResponseEntity<StandardResponse> deleteMaterialIssue(Integer id);
}
