package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.AgentPaymentDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface AgentPaymentService {

    List<AgentPaymentDto> getAllAgentPayments(HashMap<String, String> params);

    ResponseEntity<StandardResponse> saveAgentPayment(AgentPaymentDto agentPaymentDto);

    ResponseEntity<StandardResponse> UpdateAgentPayment(AgentPaymentDto agentPaymentDto);

    ResponseEntity<StandardResponse> deleteAgentPayment(Integer id);
}
