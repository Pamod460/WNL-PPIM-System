package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.GrnTypeDto;
import lk.wnl.wijeya.entity.GrnType;
import lk.wnl.wijeya.repository.GrnTypeRepository;
import lk.wnl.wijeya.service.GrnTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrnTypeServiceIMPL implements GrnTypeService {

    private final ObjectMapper objectMapper;
    private final GrnTypeRepository grnTypeRepository;
    @Override
    public List<GrnTypeDto> getAll() {
        List<GrnType> grnTypes = grnTypeRepository.findAll();
        return objectMapper.grnTypesToDtoList(grnTypes);
    }
}
