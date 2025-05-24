package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.entity.Agent;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.AgentRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AgentServiceIMPL implements AgentService {
    private final AgentRepository agentRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<AgentDto> getAll() {
        return objectMapper.toAgentDtoList(agentRepository.findAll());
    }

    @Override
    public List<AgentDto> getAllAgents(HashMap<String, String> params) {
        List<Agent> agents = this.agentRepository.findAll();
        if (!agents.isEmpty()) {
            if (params.isEmpty()) return objectMapper.toAgentDtoList(agents);

            Stream<Agent> stream = agents.stream();

            String number = params.get("number");
            String nic = params.get("nic");
            String fullname = params.get("fullname");

            if (number != null) stream = stream.filter(a -> a.getNumber().equalsIgnoreCase(number));
            if (nic != null) stream = stream.filter(a -> a.getNic().contains(nic));
            if (fullname != null) stream = stream.filter(a -> a.getFullName().toLowerCase().contains(fullname.toLowerCase()));

            return objectMapper.toAgentDtoList(stream.collect(Collectors.toList()));
        } else {
            throw new ResourceNotFoundException("Agents not found");
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> getLastAgentCode() {
        String code;
        Agent agent = agentRepository.findTopByOrderByIdDesc();

        int no = (agent != null) ? Integer.parseInt(agent.getNumber().substring(2)) + 1 : 1;

        if (no < 10) {
            code = "AG00" + no;
        } else if (no < 100) {
            code = "AG0" + no;
        } else {
            code = "AG" + no;
        }

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<StandardResponse> saveAgent(AgentDto agentDto) {
        Agent agent = objectMapper.toAgentEntity(agentDto);
        agent.setCreatedBy(userRepository.findByUsername(agentDto.getLogger()));
        if (agentRepository.existsByNumber(agent.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (agentRepository.existsByNic(agent.getNic())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (agentRepository.existsByEmail(agent.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }
        if (agentRepository.existsByMobile(agent.getMobile())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }

        Agent savedAgent = agentRepository.save(agent);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Agent Added Successfully",
                        new AgentDto(savedAgent.getId(), savedAgent.getNumber(), savedAgent.getNic(), savedAgent.getFullName())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateAgent(AgentDto agentDto) {
        Agent agent = objectMapper.toAgentEntity(agentDto);
        agentRepository.findById(agent.getId()).orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        agent.setCreatedBy(userRepository.findByUsername(agentDto.getLogger()));
        if (agentRepository.existsByNumberAndIdNot(agent.getNumber(), agent.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (agentRepository.existsByNicAndIdNot(agent.getNic(), agent.getId())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (agentRepository.existsByMobileAndIdNot(agent.getMobile(), agent.getId())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }
        if (agentRepository.existsByEmailAndIdNot(agent.getEmail(), agent.getId())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }

        Agent savedAgent = agentRepository.save(agent);
        return ResponseEntity.ok(new StandardResponse(200, "Agent Updated Successfully", new AgentDto(savedAgent.getId(), savedAgent.getNumber(), savedAgent.getNic(), savedAgent.getFullName()) ));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteAgent(Integer id) {
        Agent agent = agentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agent Not Found"));

        agentRepository.delete(agent);
        return new ResponseEntity<>(new StandardResponse(200, "Agent Deleted Successfully", null), HttpStatus.OK);
    }
}
