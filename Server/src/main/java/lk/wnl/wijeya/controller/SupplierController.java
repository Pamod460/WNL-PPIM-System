package lk.wnl.wijeya.controller;

import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.SupplierDto;
import lk.wnl.wijeya.service.SupplierService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/suppliers")
public class SupplierController {


    private final SupplierService supplierService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<SupplierDto> get() {
        return supplierService.getAll();
    }

    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastSupplier() {
        return supplierService.getLastSupplier();

    }

    @GetMapping(produces = "application/json")
    public List<SupplierDto> get(@RequestParam HashMap<String, String> params) {
        return supplierService.getAll(params);
    }

    @PreAuthorize("hasAuthority('supplier-insert')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@Valid @RequestBody SupplierDto supplierDto) {
        return supplierService.save(supplierDto);
    }

    @PreAuthorize("hasAuthority('supplier-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@Valid @RequestBody SupplierDto supplierDto) {
        return supplierService.update(supplierDto);
    }

    @PreAuthorize("hasAuthority('supplier-delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return supplierService.delete(id);

    }
}


