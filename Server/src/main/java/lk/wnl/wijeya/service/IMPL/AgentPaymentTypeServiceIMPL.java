package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentPaymentTypeDto;
import lk.wnl.wijeya.entity.AgentPaymentType;
import lk.wnl.wijeya.repository.AgentPaymentTypeRepository;
import lk.wnl.wijeya.service.AgentPaymentTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentPaymentTypeServiceIMPL implements AgentPaymentTypeService {

    private final ObjectMapper objectMapper;
    private final AgentPaymentTypeRepository agentPaymentTypeRepository;
    @Override
    public List<AgentPaymentTypeDto> getAllAgentPaymentTypes() {
        List<AgentPaymentType> paymentTypeList = agentPaymentTypeRepository.findAll();
        return objectMapper.toPaymentTypeDtoList(paymentTypeList);
    }
}
