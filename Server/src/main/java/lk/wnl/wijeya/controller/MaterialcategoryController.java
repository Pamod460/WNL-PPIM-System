package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.MaterialcategoryDao;
import lk.wnl.wijeya.entity.Materialcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialcategories")
public class MaterialcategoryController {

    @Autowired
    private MaterialcategoryDao materialcategoryDao;

    @GetMapping(produces = "application/json")
    public List<Materialcategory> get() {
        return this.materialcategoryDao.findAll();
    }

}


