package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductStatusDto;
import lk.wnl.wijeya.repository.ProductStatusRepository;
import lk.wnl.wijeya.service.ProductStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductStatusServiceIMPL implements ProductStatusService {
    private  final ObjectMapper objectMapper;
    private final ProductStatusRepository productStatusRepository;
    @Override
    public List<ProductStatusDto> getAll() {
        return objectMapper.toProductStatusDtoList(productStatusRepository.findAll());
    }

}
