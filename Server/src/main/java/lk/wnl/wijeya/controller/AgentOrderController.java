package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentOrderDto;
import lk.wnl.wijeya.service.AgentOrderService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/agentorders")
@RequiredArgsConstructor
public class AgentOrderController {

    private final AgentOrderService agentOrderService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<AgentOrderDto> get() {
        return agentOrderService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<AgentOrderDto> get(@RequestParam HashMap<String, String> params) {

        return agentOrderService.getAllAgentOrders(params);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextAgentOrder() {
        return agentOrderService.getNextAgentOrder();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody AgentOrderDto agentOrderDto) {
        return agentOrderService.saveAgentOrder(agentOrderDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody AgentOrderDto agentOrder) {
        return agentOrderService.UpdateAgentOrder(agentOrder);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return agentOrderService.deleteAgentOrder(id);
    }

}


