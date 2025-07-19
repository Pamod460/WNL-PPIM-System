package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentPaymentDto;
import lk.wnl.wijeya.service.AgentPaymentService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/agentpayments")
@RequiredArgsConstructor
public class AgentPaymentController {

    private final AgentPaymentService agentPaymentService;

    @GetMapping(produces = "application/json")
    public List<AgentPaymentDto> get(@RequestParam HashMap<String, String> params) {
        return agentPaymentService.getAllAgentPayments(params);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody AgentPaymentDto agentPaymentDto) {
        return agentPaymentService.saveAgentPayment(agentPaymentDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody AgentPaymentDto agentPaymentDto) {
        return agentPaymentService.UpdateAgentPayment(agentPaymentDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return agentPaymentService.deleteAgentPayment(id);
    }

}


