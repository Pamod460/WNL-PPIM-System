package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperSizeDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.service.PaperSizeService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papersizes")
@RequiredArgsConstructor
public class PaperSizeController {
private final PaperSizeService paperSizeService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperSizeDto> get() {

        return paperSizeService.getAll();
    }

}


