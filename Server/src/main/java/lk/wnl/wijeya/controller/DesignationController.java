package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.DesignationDao;
import lk.wnl.wijeya.entity.Designation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/designations")
public class DesignationController {

    @Autowired
    private DesignationDao designationdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Designation> get() {

        List<Designation> designations = this.designationdao.findAll();

        designations = designations.stream().map(
                designation -> { Designation d = new Designation();
                    d.setId(designation.getId());
                    d.setName(designation.getName());
                    return d; }
        ).collect(Collectors.toList());

        return designations;

    }

}


