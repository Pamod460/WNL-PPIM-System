package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductionOrderStatusDto;
import lk.wnl.wijeya.entity.ProductionOrderStatus;
import lk.wnl.wijeya.repository.ProductionOrderStatusRepository;
import lk.wnl.wijeya.service.ProductionOrderStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductionOrderStatusServiceIMPL implements ProductionOrderStatusService {

    private final ObjectMapper objectMapper;
    private final ProductionOrderStatusRepository productionOrderStatusRepository;

    @Override
    public List<ProductionOrderStatusDto> getAll() {
        List<ProductionOrderStatus> productionOrderStatuses = productionOrderStatusRepository.findAll();
        return objectMapper.toProductionOrderStatusDtoList(productionOrderStatuses);
    }
}
