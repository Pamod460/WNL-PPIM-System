package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialGrnDto;
import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MaterialGRNService {
    List<MaterialGrnDto> getAll();

    List<MaterialGrnDto> getAllMaterialGrns(HashMap<String, String> params, String authHeader);



    ResponseEntity<Map<String, String>> getNextCode(String textPart);

    ResponseEntity<StandardResponse> saveMaterialGrn(MaterialGrnDto MaterialGrnDto);

    ResponseEntity<StandardResponse> UpdateMaterialGrn(MaterialGrnDto agent);

    ResponseEntity<StandardResponse> deleteMaterialGrn(Integer id);
}
