package lk.wnl.wijeya.controller;

import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.SupplierPaymentDto;
import lk.wnl.wijeya.service.SupplierPaymentService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierpayments")
@RequiredArgsConstructor
public class SupplierPaymentController {

    private final SupplierPaymentService supplierPaymentService;

    @GetMapping(produces = "application/json")
    public List<SupplierPaymentDto> get(@RequestParam HashMap<String, String> params) {
        return supplierPaymentService.getAll(params);
    }
    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode() {
        return supplierPaymentService.getNextCode();
    }

    @PreAuthorize("hasAuthority('supplier payment-insert')")
    @PostMapping(produces = "application/json")
    public ResponseEntity<StandardResponse> save(@Valid @RequestBody SupplierPaymentDto supplierPaymentDto) {
        return supplierPaymentService.save(supplierPaymentDto);

    }

    @PreAuthorize("hasAuthority('supplier payment-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@Valid @RequestBody SupplierPaymentDto supplierPaymentDto) {
        return supplierPaymentService.update(supplierPaymentDto);

    }

    @PreAuthorize("hasAuthority('supplier payment-delete')")
    @DeleteMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return  supplierPaymentService.delete(id);

    }
}
