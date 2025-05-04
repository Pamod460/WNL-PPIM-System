package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/roles")
@RequiredArgsConstructor
public class RoleController {
private final RoleService roleService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<RoleDto> get() {

        return roleService.getAll();
    }

}


