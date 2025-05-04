package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.EmployeeStatusDto;
import lk.wnl.wijeya.service.EmployeeStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/employeestatuses")
@RequiredArgsConstructor
public class EmployeeStatusController {

    private final EmployeeStatusService eployeestatusservice;


    @GetMapping(path = "/list", produces = "application/json")
    public List<EmployeeStatusDto> get() {
        return eployeestatusservice.getAll();
    }

}


