package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.dto.CheqStatusDto;
import lk.wnl.wijeya.service.AgentStatusService;
import lk.wnl.wijeya.service.CheqStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/cheqstatus")
@RequiredArgsConstructor
public class CheqStatusController {

    private final CheqStatusService cheqStatusService;

    @GetMapping(produces = "application/json")
    public List<CheqStatusDto> get() {
        return cheqStatusService.getAllCheqStatuses();
    }
}
