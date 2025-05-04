package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.SupplierStatusDto;
import lk.wnl.wijeya.repository.SupplierStatusRepository;
import lk.wnl.wijeya.service.SupplierStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierStatusServiceIMPL implements SupplierStatusService {
    private final SupplierStatusRepository supplierStatusRepository;
private final ObjectMapper objectMapper;
    @Override
    public List<SupplierStatusDto> getAll() {
        return objectMapper.toSupplierStatusDtoList(supplierStatusRepository.findAll());
    }
}
