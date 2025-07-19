package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.GrnTypeDto;
import lk.wnl.wijeya.service.GrnTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/grntypes")
@RequiredArgsConstructor
public class GrnTypeController {

    private final GrnTypeService grnTypeService;

    @GetMapping(produces = "application/json")
    public List<GrnTypeDto> get() {
        return this.grnTypeService.getAll();
    }
}
