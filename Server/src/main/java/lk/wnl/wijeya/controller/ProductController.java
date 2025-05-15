package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductDto;
import lk.wnl.wijeya.service.ProductService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductDto> get() {
        return productService.getAllList();
    }

    @GetMapping(produces = "application/json")
    public List<ProductDto> get(@RequestParam HashMap<String, String> params) {
        return productService.getAll(params);
    }

    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastSupplier() {
        return productService.getLastProduct();

    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody ProductDto productDto) {
        return productService.update(productDto);
    }



    @PostMapping
    public ResponseEntity<StandardResponse> save(@RequestBody ProductDto productDto) {
        return productService.save(productDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return productService.delete(id);
    }
}


