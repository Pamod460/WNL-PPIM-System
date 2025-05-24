package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface AgentService {

    List<AgentDto> getAll();

    List<AgentDto> getAllAgents(HashMap<String, String> params);

    ResponseEntity<Map<String, String>> getLastAgentCode();

    ResponseEntity<StandardResponse> saveAgent(AgentDto agentDto);

    ResponseEntity<StandardResponse> UpdateAgent(AgentDto agent);

    ResponseEntity<StandardResponse> deleteAgent(Integer id);
}
