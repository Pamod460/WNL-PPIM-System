package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.UsrtypeDao;
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
@RequestMapping(value = "/usrtypes")
public class UsrtypeController {

    @Autowired
    private UsrtypeDao usrtypeDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Usetype> get() {

        List<Usetype> usrtypes = this.usrtypeDao.findAll();

        usrtypes = usrtypes.stream().map(
                usrtype -> { Usetype d = new Usetype();
                    d.setId(usrtype.getId());
                    d.setName(usrtype.getName());
                    return d; }
        ).collect(Collectors.toList());

        return usrtypes;

    }

}


