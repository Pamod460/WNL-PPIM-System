package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.EmptypeDao;
import lk.wnl.wijeya.entity.Emptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/empolyeestypes")
public class EmptypeController {

    @Autowired
    private EmptypeDao emptypedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Emptype> get() {

        List<Emptype> emptypes = this.emptypedao.findAll();

        emptypes = emptypes.stream().map(
                emptype -> { Emptype d = new Emptype();
                    d.setId(emptype.getId());
                    d.setName(emptype.getName());
                    return d; }
        ).collect(Collectors.toList());

        return emptypes;

    }

}


