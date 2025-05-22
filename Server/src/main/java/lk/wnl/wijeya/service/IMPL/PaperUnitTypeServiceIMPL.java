package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperTypeDto;
import lk.wnl.wijeya.dto.PaperUnitTypeDto;
import lk.wnl.wijeya.repository.PaperTypeRepository;
import lk.wnl.wijeya.repository.PaperUnitTypeRepository;
import lk.wnl.wijeya.service.PaperUnitTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PaperUnitTypeServiceIMPL implements PaperUnitTypeService {
    private final PaperUnitTypeRepository paperUnitTypeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperUnitTypeDto> getAll() {
        return objectMapper.toPaperUnitTypeDtoList(paperUnitTypeRepository.findAll());
    }
}
