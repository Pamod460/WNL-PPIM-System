package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperGrnStatusDto;
import lk.wnl.wijeya.service.PaperGRNStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/papergrnstatuses")
@RequiredArgsConstructor
public class PaperGRNStatusController {

    private final PaperGRNStatusService paperGrnStatusService;

    @GetMapping
    public List<PaperGrnStatusDto> getAll(){
        return paperGrnStatusService.getAll();
    }
}
