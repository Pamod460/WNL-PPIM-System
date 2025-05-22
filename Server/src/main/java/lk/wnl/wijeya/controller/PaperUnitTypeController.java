package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperUnitTypeDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.PaperUnitType;
import lk.wnl.wijeya.service.PaperUnitTypeService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/paperunittypes")
@RequiredArgsConstructor
public class PaperUnitTypeController {
private final PaperUnitTypeService paperUnitTypeService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperUnitTypeDto> get() {

        return paperUnitTypeService.getAll();
    }

}


