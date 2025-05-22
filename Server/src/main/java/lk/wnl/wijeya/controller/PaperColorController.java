package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperColorDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.PaperColor;
import lk.wnl.wijeya.service.PaperColorService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papercolors")
@RequiredArgsConstructor
public class PaperColorController {
private final PaperColorService paperColorService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperColorDto> get() {

        return paperColorService.getAll();
    }

}


