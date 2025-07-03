package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.MaterialPorderStatusDto;
import lk.wnl.wijeya.repository.MaterialPorderStatusRepository;
import lk.wnl.wijeya.service.MaterialPorderStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class MaterialPorderStatusServiceIMPL implements MaterialPorderStatusService {
private final MaterialPorderStatusRepository materialPorderStatusRepository;
private final ObjectMapper objectMapper;
    @Override
    public List<MaterialPorderStatusDto> getAll() {
        return objectMapper.toMaterialPoderStatusDtoList(materialPorderStatusRepository.findAll());
    }
}

