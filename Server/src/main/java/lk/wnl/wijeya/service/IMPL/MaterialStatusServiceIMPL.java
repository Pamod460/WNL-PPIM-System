package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialstatusDto;
import lk.wnl.wijeya.repository.MaterialstatusRepository;
import lk.wnl.wijeya.service.MaterialStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialStatusServiceIMPL implements MaterialStatusService {
    private final MaterialstatusRepository materialstatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MaterialstatusDto> getAll() {
        return objectMapper.toMaterialStatusDtoList( materialstatusRepository.findAll());
    }
}
