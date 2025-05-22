package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperGsmDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.PaperGsm;
import lk.wnl.wijeya.service.PaperGsmService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papergsms")
@RequiredArgsConstructor
public class PaperGsmController {
private final PaperGsmService paperGsmService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperGsmDto> get() {

        return paperGsmService.getAll();
    }

}


