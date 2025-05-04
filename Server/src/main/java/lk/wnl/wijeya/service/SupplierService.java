package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.SupplierDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SupplierService {
    ResponseEntity<StandardResponse> delete(Integer id);

    ResponseEntity<StandardResponse> update(SupplierDto supplierDto);

    List<SupplierDto> getAll();
    List<SupplierDto> getAll( HashMap<String, String>  params);

    ResponseEntity<Map<String, String>> getLastSupplier();

    ResponseEntity<StandardResponse> save(SupplierDto supplierDto);
}
