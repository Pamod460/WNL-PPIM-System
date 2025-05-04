package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialsubcategoryDto;
import lk.wnl.wijeya.repository.MaterialsubcategoryRepository;
import lk.wnl.wijeya.service.MaterialSubcategoryService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialSubcategoryServiceIMPL implements MaterialSubcategoryService {
    private final MaterialsubcategoryRepository materialsubcategoryRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<MaterialsubcategoryDto> getAll() {
        return objectMapper.toMaterialsubcategoryDTOList(materialsubcategoryRepository.findAll());
    }
}
