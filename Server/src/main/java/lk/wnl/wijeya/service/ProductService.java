package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.ProductDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ProductService {

    List<ProductDto> getAll(HashMap<String, String> params);

    List<ProductDto> getAllList();

    ResponseEntity<StandardResponse> update(ProductDto productDto);

    ResponseEntity<StandardResponse> save(ProductDto productDto);

    ResponseEntity<StandardResponse> delete(Integer id);

    ResponseEntity<Map<String, String>> getLastProduct();
}
