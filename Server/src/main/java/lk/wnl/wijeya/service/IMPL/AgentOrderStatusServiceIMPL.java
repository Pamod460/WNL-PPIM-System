package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentOrderStatusDto;
import lk.wnl.wijeya.entity.AgentOrderStatus;
import lk.wnl.wijeya.repository.AgentOrderStatusRepository;
import lk.wnl.wijeya.service.AgentOrderStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentOrderStatusServiceIMPL implements AgentOrderStatusService {
    private final AgentOrderStatusRepository agentOrderStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<AgentOrderStatusDto> getAll() {
        List<AgentOrderStatus> agentOrderStatusList = agentOrderStatusRepository.findAll();
        return objectMapper.toAgentOrderStatusDtoList(agentOrderStatusList);
    }
}
