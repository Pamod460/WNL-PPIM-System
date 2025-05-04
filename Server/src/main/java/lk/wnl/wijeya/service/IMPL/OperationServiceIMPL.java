package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.OperationDto;
import lk.wnl.wijeya.repository.OperationRepository;
import lk.wnl.wijeya.service.OperationService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class OperationServiceIMPL implements OperationService {
    private final OperationRepository operationRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<OperationDto> getAll() {
        return objectMapper.toOprationDtoList(operationRepository.findAll());
    }
}
