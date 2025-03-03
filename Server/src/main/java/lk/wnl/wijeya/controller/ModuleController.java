package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dao.ModuleDao;
import lk.wnl.wijeya.entity.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/modules")
public class ModuleController {

    @Autowired
    private ModuleDao moduledao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Module> get() {

        List<Module> modules = this.moduledao.findAll();

        modules = modules.stream().map(
                module -> { Module m = new Module();
                            m.setId(module.getId());
                            m.setName(module.getName());
                            return m; }
        ).collect(Collectors.toList());

        return modules;

    }

}


