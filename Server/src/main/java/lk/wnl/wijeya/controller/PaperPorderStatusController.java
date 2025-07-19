package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperPorderStatusDto;
import lk.wnl.wijeya.service.PaperPorderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/paperporderstatuses")
@RequiredArgsConstructor
public class PaperPorderStatusController {

    private final PaperPorderStatusService paperPorderStatusService;

    @GetMapping
    public List<PaperPorderStatusDto> getAll(){
        return paperPorderStatusService.getAll();
    }
}
