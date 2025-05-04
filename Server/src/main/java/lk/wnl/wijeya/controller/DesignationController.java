package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.DesignationDto;
import lk.wnl.wijeya.service.DesignationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/designations")
@RequiredArgsConstructor
public class DesignationController {
    private final DesignationService designationService;


    @GetMapping(path = "/list", produces = "application/json")
    public List<DesignationDto> get() {

        return designationService.getAllDesignations();

    }

}


