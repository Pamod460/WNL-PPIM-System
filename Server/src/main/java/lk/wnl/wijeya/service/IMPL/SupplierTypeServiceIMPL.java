package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.SupplierTypeDto;
import lk.wnl.wijeya.repository.SupplierTypeRepository;
import lk.wnl.wijeya.service.SupplierTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierTypeServiceIMPL implements SupplierTypeService {
    private final SupplierTypeRepository supplierTypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<SupplierTypeDto> getAll() {
        return objectMapper.toSupplierTypeDtoList(supplierTypeRepository.findAll());
    }
}
