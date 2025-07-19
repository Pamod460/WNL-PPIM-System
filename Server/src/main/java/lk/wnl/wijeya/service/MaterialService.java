package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MaterialService {
    List<MaterialDto> getAllList(HashMap<String, String> params);
    List<MaterialDto> getAllList();

    ResponseEntity<StandardResponse> save(MaterialDto materialDto);

    ResponseEntity<StandardResponse> update(MaterialDto materialDto);

    ResponseEntity<StandardResponse> detele(Integer id);

    ResponseEntity<Map<String, String>> getNextCode(String textPart);

    void increaseQuantity(Integer id, BigDecimal quantity);

    void decreaseQuantity(Integer id, BigDecimal quantity);
}
