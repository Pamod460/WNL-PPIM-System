package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductCategoryDto;
import lk.wnl.wijeya.repository.ProductCategoryRepository;
import lk.wnl.wijeya.service.ProductCategoryService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceIMPL implements ProductCategoryService {
    private final ObjectMapper objectMapper;
    private final ProductCategoryRepository productCategoryRepository;

    @Override
    public List<ProductCategoryDto> getAll() {
        return objectMapper.toProductTypeDtoList(productCategoryRepository.findAll());
    }
}
