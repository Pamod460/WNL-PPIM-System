package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductionOrderDto;
import lk.wnl.wijeya.service.ProductionOrderService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/productionorders")
@RequiredArgsConstructor
public class ProductionOrderController {

    private final ProductionOrderService productionOrderService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductionOrderDto> get() {
        return productionOrderService.getAllList();
    }

    @GetMapping(produces = "application/json")
    public List<ProductionOrderDto> get(@RequestParam HashMap<String, String> params) {
        return productionOrderService.getAllList(params);
    }

    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextProductionOrderCode() {
        return productionOrderService.getNextCode();

    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody ProductionOrderDto productionOrderDto) {
        return productionOrderService.update(productionOrderDto);
    }



    @PostMapping
    public ResponseEntity<StandardResponse> save(@RequestBody ProductionOrderDto productionOrderDto) {
        return productionOrderService.save(productionOrderDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return productionOrderService.detele(id);
    }
}
