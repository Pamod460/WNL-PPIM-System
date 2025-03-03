package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.RoleDao;
import lk.wnl.wijeya.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/roles")
public class RoleController {

    @Autowired
    private RoleDao roledao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Role> get() {

        List<Role> roles = this.roledao.findAll();

        roles = roles.stream().map(
                role -> { Role r = new Role();
                            r.setId(role.getId());
                            r.setName(role.getName());
                            return r; }
        ).collect(Collectors.toList());

        return roles;

    }

}


