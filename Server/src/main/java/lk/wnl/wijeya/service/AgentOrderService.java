package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.AgentOrderDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface AgentOrderService {

    List<AgentOrderDto> getAll();

    List<AgentOrderDto> getAllAgentOrders(HashMap<String, String> params);

    ResponseEntity<Map<String, String>> getNextAgentOrder();

    ResponseEntity<StandardResponse> saveAgentOrder(AgentOrderDto agentOrderDto);

    ResponseEntity<StandardResponse> UpdateAgentOrder(AgentOrderDto agentOrder);

    ResponseEntity<StandardResponse> deleteAgentOrder(Integer id);
}
