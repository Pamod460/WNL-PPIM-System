package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.ProductionOrderDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ProductionOrderService {
    List<ProductionOrderDto> getAllList(HashMap<String, String> params);
    List<ProductionOrderDto> getAllList();

    ResponseEntity<StandardResponse> save(ProductionOrderDto productionOrderDto);

    ResponseEntity<StandardResponse> update(ProductionOrderDto productionOrderDto);

    ResponseEntity<StandardResponse> detele(Integer id);

    ResponseEntity<Map<String, String>> getNextCode();
}
