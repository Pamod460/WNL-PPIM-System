package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.UnittypeDao;
import lk.wnl.wijeya.dao.UsrtypeDao;
import lk.wnl.wijeya.entity.Unittype;
import lk.wnl.wijeya.entity.Usetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/unittypes")
public class UnittypeController {

    @Autowired
    private UnittypeDao unittypeDao;

    @GetMapping(produces = "application/json")
    public List<Unittype> get() {
        return this.unittypeDao.findAll();
    }

}


