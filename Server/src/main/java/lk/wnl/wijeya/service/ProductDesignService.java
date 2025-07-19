package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.dto.ProductDesignDto;
import lk.wnl.wijeya.entity.ProductDesign;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ProductDesignService {
    List<ProductDesignDto> getAllList(HashMap<String, String> params);
    List<ProductDesignDto> getAllList();

    ResponseEntity<StandardResponse> save(ProductDesignDto productDesignDto);

    ResponseEntity<StandardResponse> update(ProductDesignDto productDesignDto);

    ResponseEntity<StandardResponse> detele(Integer id);

    ResponseEntity<Map<String, String>> getNextCode(String textPart);
}
