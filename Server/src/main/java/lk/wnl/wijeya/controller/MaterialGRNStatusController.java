package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dto.MaterialGrnStatusDto;
import lk.wnl.wijeya.service.MaterialGRNStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/materialgrnstatuses")
@RequiredArgsConstructor
public class MaterialGRNStatusController {

    private final MaterialGRNStatusService materialGRNStatusService;

    @GetMapping
    public List<MaterialGrnStatusDto> getAll(){
        return materialGRNStatusService.getAll();
    }
}
