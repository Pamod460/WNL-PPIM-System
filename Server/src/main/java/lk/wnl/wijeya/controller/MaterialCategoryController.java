package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialCategoryDto;
import lk.wnl.wijeya.service.MaterialCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialcategories")
@RequiredArgsConstructor
public class MaterialCategoryController {

private final MaterialCategoryService materialCategoryService;

    @GetMapping(produces = "application/json")
    public List<MaterialCategoryDto> get() {
        return this.materialCategoryService.getAll();
    }

}


