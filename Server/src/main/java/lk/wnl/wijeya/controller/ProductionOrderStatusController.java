package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductStatusDto;
import lk.wnl.wijeya.dto.ProductionOrderStatusDto;
import lk.wnl.wijeya.service.ProductionOrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productionorderstatuses")
@RequiredArgsConstructor
public class ProductionOrderStatusController {

    private final ProductionOrderStatusService productionOrderStatusService;

    @GetMapping(produces = "application/json")
    public List<ProductionOrderStatusDto> get() {
        return productionOrderStatusService.getAll();
    }
}
