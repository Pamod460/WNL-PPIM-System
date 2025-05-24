package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.dto.DistrictDto;
import lk.wnl.wijeya.entity.AgentStatus;
import lk.wnl.wijeya.entity.District;
import lk.wnl.wijeya.repository.AgentStatusRepository;
import lk.wnl.wijeya.repository.DistrictRepository;
import lk.wnl.wijeya.service.AgentStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class AgentStatusServiceIMPL implements AgentStatusService {
    private final AgentStatusRepository agentStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<AgentStatusDto> getAll() {
        List<AgentStatus> agentStatusList = agentStatusRepository.findAll();
        return objectMapper.toAgentStatusDtoList(agentStatusList);
    }
}
