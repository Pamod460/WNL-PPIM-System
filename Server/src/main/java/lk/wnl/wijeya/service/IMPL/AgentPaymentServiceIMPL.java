package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentPaymentDto;
import lk.wnl.wijeya.entity.AgentPayment;
import lk.wnl.wijeya.entity.CheqPayment;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.AgentPaymentRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentPaymentService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AgentPaymentServiceIMPL implements AgentPaymentService {

    private final ObjectMapper objectMapper;
    private final AgentPaymentRepository agentPaymentRepository;
    private final UserRepository userRepository;
    @Override
    public List<AgentPaymentDto> getAllAgentPayments(HashMap<String, String> params) {
        List<AgentPayment> agentPaymentList = this.agentPaymentRepository.findAll();

            if (params.isEmpty()) return objectMapper.toAgentPaymentDtoList(agentPaymentList);

            Stream<AgentPayment> stream = agentPaymentList.stream();

            String date = params.get("date");
            String distribution = params.get("distribution");
            String agentPaymentType = params.get("agentPaymentType");
            String paymentStatus = params.get("paymentStatus");

            if (date != null) stream = stream.filter(a -> a.getDate().equals(LocalDate.parse(date)));
            if (distribution != null) stream = stream.filter(a -> a.getDistribution().getDistributionNumber().equals(distribution));
            if (agentPaymentType != null) stream = stream.filter(a -> a.getAgentPaymentType().getId() == Integer.parseInt(agentPaymentType));
            if (paymentStatus != null) stream = stream.filter(a -> a.getPaymentStatus().getId() == Integer.parseInt(paymentStatus));

            return objectMapper.toAgentPaymentDtoList(stream.collect(Collectors.toList()));

    }


    @Override
    public ResponseEntity<StandardResponse> saveAgentPayment(AgentPaymentDto agentPaymentDto) {
        AgentPayment agentPayment = objectMapper.toAgentPayment(agentPaymentDto);
        agentPayment.setCreatedBy(userRepository.findByUsername(agentPaymentDto.getLogger()));

        for (CheqPayment cheqPayment : agentPayment.getCheqPayments()) {
          cheqPayment.setAgentPayment(agentPayment);
        }
        AgentPayment savedAgentPayment = agentPaymentRepository.save(agentPayment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Agent Payment Added Successfully",
                        new AgentPaymentDto(savedAgentPayment.getId())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateAgentPayment(AgentPaymentDto agentPaymentDto) {
        agentPaymentRepository.findById(agentPaymentDto.getId()).orElseThrow(() -> new ResourceNotFoundException("Agent Payment not found"));
        AgentPayment agentPayment = objectMapper.toAgentPayment(agentPaymentDto);
        agentPayment.setCreatedBy(userRepository.findByUsername(agentPayment.getLogger()));

        for (CheqPayment cheqPayment : agentPayment.getCheqPayments()) {
            cheqPayment.setAgentPayment(agentPayment);
        }
        AgentPayment savedAgentPayment = agentPaymentRepository.save(agentPayment);
        return ResponseEntity.ok(new StandardResponse(200, "Agent Payment Updated Successfully", new AgentPaymentDto(savedAgentPayment.getId()) ));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteAgentPayment(Integer id) {
        AgentPayment agentPayment = agentPaymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agent Payment Not Found"));

        agentPaymentRepository.delete(agentPayment);
        return new ResponseEntity<>(new StandardResponse(200, "Agent Deleted Successfully", null), HttpStatus.OK);
    }
}
