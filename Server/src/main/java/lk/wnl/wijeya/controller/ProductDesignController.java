package lk.wnl.wijeya.controller;

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

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody ProductDesignDto productDesignDto) {
        return productDesignService.update(productDesignDto);
    }



    @PostMapping
    public ResponseEntity<StandardResponse> save(@RequestBody ProductDesignDto productDesignDto) {
        return productDesignService.save(productDesignDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return productDesignService.detele(id);
    }
}
