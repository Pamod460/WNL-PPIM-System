package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperTypeDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.service.PaperTypeService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papertypes")
@RequiredArgsConstructor
public class PaperTypeController {
private final PaperTypeService paperTypeService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperTypeDto> get() {

        return paperTypeService.getAll();
    }

}


