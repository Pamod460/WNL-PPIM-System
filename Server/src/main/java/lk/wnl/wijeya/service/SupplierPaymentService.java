package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.SupplierPaymentDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SupplierPaymentService {

    ResponseEntity<StandardResponse> delete(Integer id);

    ResponseEntity<StandardResponse> update(SupplierPaymentDto supplierPaymentDto);
    
    List<SupplierPaymentDto> getAll( HashMap<String, String> params);

    ResponseEntity<Map<String, String>> getNextCode();

    ResponseEntity<StandardResponse> save(SupplierPaymentDto supplierPaymentDto);

}
