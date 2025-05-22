package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperStatusDto;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.service.PaperStatusService;
import lk.wnl.wijeya.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/paperstatuses")
@RequiredArgsConstructor
public class PaperStatusController {
private final PaperStatusService paperStatusService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<PaperStatusDto> get() {

        return paperStatusService.getAll();
    }

}


