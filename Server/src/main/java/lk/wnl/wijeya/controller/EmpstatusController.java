package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.EmpstatusDao;
import lk.wnl.wijeya.entity.Empstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/employeestatuses")
public class EmpstatusController {

    @Autowired
    private EmpstatusDao empstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Empstatus> get() {

        List<Empstatus> empstatuss = this.empstatusdao.findAll();

        empstatuss = empstatuss.stream().map(
                empstatus -> { Empstatus d = new Empstatus();
                    d.setId(empstatus.getId());
                    d.setName(empstatus.getName());
                    return d; }
        ).collect(Collectors.toList());

        return empstatuss;

    }

}


