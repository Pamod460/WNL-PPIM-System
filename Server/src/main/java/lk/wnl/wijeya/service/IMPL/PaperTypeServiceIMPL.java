package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperTypeDto;
import lk.wnl.wijeya.repository.PaperTypeRepository;
import lk.wnl.wijeya.service.PaperTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PaperTypeServiceIMPL implements PaperTypeService {
    private final PaperTypeRepository paperTypeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperTypeDto> getAll() {
        return objectMapper.toPaperTypeDtoList(paperTypeRepository.findAll());
    }



}
