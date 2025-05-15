package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductFrequencyDto;
import lk.wnl.wijeya.service.ProductFrequencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productfrequencies")
@RequiredArgsConstructor
public class ProductFrequencyController {

    private final ProductFrequencyService productFrequencyService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductFrequencyDto> get() {
        return productFrequencyService.getAll();
    }

}


