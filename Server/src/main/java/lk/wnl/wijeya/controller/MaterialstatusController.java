package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.MaterialstatusDao;
import lk.wnl.wijeya.entity.Materialstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialstatuses")
public class MaterialstatusController {

    @Autowired
    private MaterialstatusDao materialstatusDao;

    @GetMapping( produces = "application/json")
    public List<Materialstatus> get() {


        return this.materialstatusDao.findAll();

    }

}


