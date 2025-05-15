package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductFrequencyDto;
import lk.wnl.wijeya.repository.ProductFrequencyRepository;
import lk.wnl.wijeya.service.ProductFrequencyService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductFrequencyServiceIMPL implements ProductFrequencyService {
private final ObjectMapper objectMapper;

private final  ProductFrequencyRepository productFrequencyRepository;
    @Override
    public List<ProductFrequencyDto> getAll() {
        return objectMapper.toProductFrequencyDtoList(productFrequencyRepository.findAll());
    }
}
