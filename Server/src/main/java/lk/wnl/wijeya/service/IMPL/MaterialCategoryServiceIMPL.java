package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialCategoryDto;
import lk.wnl.wijeya.repository.MaterialCategoryRepository;
import lk.wnl.wijeya.service.MaterialCategoryService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialCategoryServiceIMPL implements MaterialCategoryService {
    private final MaterialCategoryRepository materialCategoryRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MaterialCategoryDto> getAll() {
        return objectMapper.toMaterialCategoryDtoList(materialCategoryRepository.findAll());
    }
}
