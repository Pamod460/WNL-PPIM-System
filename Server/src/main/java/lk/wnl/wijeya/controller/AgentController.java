package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.dto.AgentVerifyRequest;
import lk.wnl.wijeya.service.AgentService;
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
@RequestMapping(value = "/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<AgentDto> get() {
        return agentService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<AgentDto> get(@RequestParam HashMap<String, String> params) {
        return agentService.getAllAgents(params);
    }


    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastAgent() {
        return agentService.getLastAgentCode();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody AgentDto agentDto) {
        return agentService.saveAgent(agentDto);
    }

    @PostMapping(path = "/verify", produces = "application/json")
    public AgentDto verify(@RequestBody AgentVerifyRequest request) {
        return agentService.verifyAgent(request);
    }

    @PreAuthorize("hasAuthority('agent-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody AgentDto agent) {
        return agentService.UpdateAgent(agent);

    }

    @PreAuthorize("hasAuthority('agent-delete')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return agentService.deleteAgent(id);
    }

}


