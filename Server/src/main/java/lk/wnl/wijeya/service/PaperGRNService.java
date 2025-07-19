package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperGrnDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PaperGRNService {
    List<PaperGrnDto> getAll();

    List<PaperGrnDto> getAllPaperGrns(HashMap<String, String> params, String authHeader);




    ResponseEntity<StandardResponse> savePaperGrn(PaperGrnDto PaperGrnDto);

    ResponseEntity<StandardResponse> UpdatePaperGrn(PaperGrnDto agent);

    ResponseEntity<StandardResponse> deletePaperGrn(Integer id);

    ResponseEntity<Map<String, String>> getNextCode(String textPart);
}
