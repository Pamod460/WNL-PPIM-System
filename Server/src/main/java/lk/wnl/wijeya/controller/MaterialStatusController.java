package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialstatusDto;
import lk.wnl.wijeya.service.MaterialStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialstatuses")
@RequiredArgsConstructor
public class MaterialStatusController {
private final MaterialStatusService materialStatusService;

    @GetMapping( produces = "application/json")
    public List<MaterialstatusDto> get() {
        return materialStatusService.getAll();

    }

}


