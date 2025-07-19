package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentOrderStatusDto;
import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.service.AgentOrderStatusService;
import lk.wnl.wijeya.service.AgentStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/agentorderstatuses")
@RequiredArgsConstructor
public class AgentOrderStatusController {

    private final AgentOrderStatusService agentOrderStatusService;

    @GetMapping(produces = "application/json")
    public List<AgentOrderStatusDto> get() {
        return agentOrderStatusService.getAll();
    }

}


