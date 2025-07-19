package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PaperService {
    List<PaperDto> getAllList(HashMap<String, String> params);
    List<PaperDto> getAllList();

    ResponseEntity<StandardResponse> save(PaperDto paperDto);

    ResponseEntity<StandardResponse> update(PaperDto paperDto);

    ResponseEntity<StandardResponse> detele(Integer id);

    ResponseEntity<Map<String, String>> getNextCode(String textPart);

    @Transactional
    void increaseQuantity(Integer id, BigDecimal quantity);

    @Transactional
    void decreaseQuantity(Integer id, BigDecimal quantity);
}
