package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PaperPorderService {
    List<PaperPorderDto> getAll();



    List<PaperPorderDto> getAllPaperPorders(HashMap<String, String> params, String authHeader);



    ResponseEntity<Map<String, String>> getNextCode(String textPart);

    ResponseEntity<StandardResponse> savePaperPorder(PaperPorderDto PaperPorderDto);

    ResponseEntity<StandardResponse> UpdatePaperPorder(PaperPorderDto agent);

    ResponseEntity<StandardResponse> deletePaperPorder(Integer id);

    void updatePaperPorderStatus(Integer paperPOrderId, Integer statusId);

    void updatePorderReceivingStatus(Integer porderId);
}
