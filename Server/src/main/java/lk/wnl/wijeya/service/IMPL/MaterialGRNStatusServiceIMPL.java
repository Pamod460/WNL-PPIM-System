package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.MaterialGrnStatusDto;
import lk.wnl.wijeya.repository.MaterialGRNStatusRepository;
import lk.wnl.wijeya.service.MaterialGRNStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class MaterialGRNStatusServiceIMPL implements MaterialGRNStatusService {
    private final MaterialGRNStatusRepository materialGRNStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MaterialGrnStatusDto> getAll() {
        return objectMapper.toMaterialGrnStatusDtoList(materialGRNStatusRepository.findAll());
    }
}

