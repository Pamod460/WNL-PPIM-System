package lk.wnl.wijeya.controller;

import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.ProductDesignDto;
import lk.wnl.wijeya.service.ProductDesignService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productdesigns")
@RequiredArgsConstructor
public class ProductDesignController {
    private final ProductDesignService productDesignService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductDesignDto> get() {
        return productDesignService.getAllList();
    }

    @GetMapping(produces = "application/json")
    public List<ProductDesignDto> get(@RequestParam HashMap<String, String> params) {
        return productDesignService.getAllList(params);
    }

//    @GetMapping(value = "/last", produces = "application/json")
//    public ResponseEntity<Map<String, String>> getLastSupplier() {
//        return productDesignService.getNextCode();
//
//    }

    @PreAuthorize("hasAuthority('product design-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@Valid @RequestBody ProductDesignDto productDesignDto) {
        return productDesignService.update(productDesignDto);
    }



    @PreAuthorize("hasAuthority('product design-insert')")
    @PostMapping
    public ResponseEntity<StandardResponse> save(@Valid @RequestBody ProductDesignDto productDesignDto) {
        return productDesignService.save(productDesignDto);
    }

    @PreAuthorize("hasAuthority('product design-delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return productDesignService.detele(id);
    }
}
