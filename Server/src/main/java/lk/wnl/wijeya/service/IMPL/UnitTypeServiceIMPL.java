package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.UnitTypeDto;
import lk.wnl.wijeya.repository.UsrtypeRepository;
import lk.wnl.wijeya.service.UnitTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor

public class UnitTypeServiceIMPL implements UnitTypeService {
    private final UsrtypeRepository usrtypeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<UnitTypeDto> getAll() {
        return objectMapper.toUnitTypeDtoList(usrtypeRepository.findAll());
    }
}
