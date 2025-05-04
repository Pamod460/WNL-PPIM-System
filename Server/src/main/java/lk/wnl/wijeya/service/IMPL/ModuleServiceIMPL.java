package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ModuleDto;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.service.ModuleService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleServiceIMPL implements ModuleService {
    private final ModuleRepository moduleRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<ModuleDto> getAll() {
        return objectMapper.toModuleDtoList(moduleRepository.findAll());
    }
}
