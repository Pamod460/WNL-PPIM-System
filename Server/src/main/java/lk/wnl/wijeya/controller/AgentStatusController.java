package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.service.AgentStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/agentstatuses")
@RequiredArgsConstructor
public class AgentStatusController {

    private final AgentStatusService agentStatusService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<AgentStatusDto> get() {
        return agentStatusService.getAll();
    }

}


