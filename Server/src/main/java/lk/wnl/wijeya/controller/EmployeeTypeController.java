package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.EmployeeTypeDto;
import lk.wnl.wijeya.service.EmployeeTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/empolyeestypes")
@RequiredArgsConstructor
public class EmployeeTypeController {
private final EmployeeTypeService employeeTypeService;

    @GetMapping(path ="/list", produces = "application/json")
    public List<EmployeeTypeDto> get() {
        return this.employeeTypeService.getAll();



    }

}


