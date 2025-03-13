package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.MaterialsubcategoryDao;
import lk.wnl.wijeya.entity.Materialsubcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialsubcategories")
public class MaterialsubcategoryController {

    @Autowired
    private MaterialsubcategoryDao materialsubcategoryDao;

    @GetMapping( produces = "application/json")
    public List<Materialsubcategory> get() {


        return this.materialsubcategoryDao.findAll();

    }

}


