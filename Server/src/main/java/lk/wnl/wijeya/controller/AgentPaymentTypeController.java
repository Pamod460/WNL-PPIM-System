package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentPaymentTypeDto;
import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.service.AgentPaymentTypeService;
import lk.wnl.wijeya.service.AgentStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/agentpaymenttype")
@RequiredArgsConstructor
public class AgentPaymentTypeController {

    private final AgentPaymentTypeService agentPaymentTypeService;

    @GetMapping(produces = "application/json")
    public List<AgentPaymentTypeDto> get() {
        return agentPaymentTypeService.getAllAgentPaymentTypes();
    }
}
