package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.ProductCategoryDto;
import lk.wnl.wijeya.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/productcategories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<ProductCategoryDto> get() {
        return productCategoryService.getAll();
    }

}


