package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductStatusDto;
import lk.wnl.wijeya.service.ProductStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productstatuses")
@RequiredArgsConstructor
public class ProductStatusController {

    private final ProductStatusService productStatusService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductStatusDto> get() {
        return productStatusService.getAll();
    }

}


