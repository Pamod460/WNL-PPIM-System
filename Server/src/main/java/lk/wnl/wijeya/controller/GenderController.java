package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.GenderDao;
import lk.wnl.wijeya.entity.Gender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin
@RestController
@RequestMapping(value = "/genders")
public class GenderController {

    @Autowired
    private GenderDao genderdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Gender> get() {

        List<Gender> genders = this.genderdao.findAll();

        genders = genders.stream().map(
                gender -> { Gender g = new Gender();
                            g.setId(gender.getId());
                            g.setName(gender.getName());
                            return g; }
        ).collect(Collectors.toList());

        return genders;

    }

}


