package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialPorderDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MaterialPorderService {
    List<MaterialPorderDto> getAll();

    List<MaterialPorderDto> getAllMaterialPorders(HashMap<String, String> params, String authHeader);


    ResponseEntity<Map<String, String>> getNextCode(String textPart);

    ResponseEntity<StandardResponse> saveMaterialPorder(MaterialPorderDto MaterialPorderDto);

    ResponseEntity<StandardResponse> UpdateMaterialPorder(MaterialPorderDto agent);

    ResponseEntity<StandardResponse> deleteMaterialPorder(Integer id);

    void updateMaterialPorderStatus(Integer materialPorderId, Integer statusId);

    void updatePorderReceivingStatus(Integer porderId);
}
