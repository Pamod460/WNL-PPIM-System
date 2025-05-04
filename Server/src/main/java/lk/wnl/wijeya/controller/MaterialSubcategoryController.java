package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialsubcategoryDto;
import lk.wnl.wijeya.entity.Materialsubcategory;
import lk.wnl.wijeya.service.MaterialSubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialsubcategories")
@RequiredArgsConstructor
public class MaterialSubcategoryController {
    private final MaterialSubcategoryService materialSubcategoryService;

    @GetMapping( produces = "application/json")
    public List<MaterialsubcategoryDto> get() {
        return materialSubcategoryService.getAll();
    }

}


