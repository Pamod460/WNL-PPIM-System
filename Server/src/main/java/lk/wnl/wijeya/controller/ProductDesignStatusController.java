package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductDesignStatusDto;
import lk.wnl.wijeya.service.ProductDesignStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productdesignstatuses")
@RequiredArgsConstructor
public class ProductDesignStatusController {

    private final ProductDesignStatusService productDesignStatusService;

    @GetMapping(produces = "application/json")
    public List<ProductDesignStatusDto> get() {
        return productDesignStatusService.getAll();
    }
}
