package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialPorderStatusDto;
import lk.wnl.wijeya.service.MaterialPorderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/materialporderstatus")
@RequiredArgsConstructor
public class MaterialPorderStatusController {

    private final MaterialPorderStatusService materialPorderStatusService;

    @GetMapping
    public List<MaterialPorderStatusDto> getAll(){
        return materialPorderStatusService.getAll();
    }
}
