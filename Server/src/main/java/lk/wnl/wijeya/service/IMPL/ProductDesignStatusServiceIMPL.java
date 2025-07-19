package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductDesignStatusDto;
import lk.wnl.wijeya.entity.ProductDesignStatus;
import lk.wnl.wijeya.repository.ProductDesignStatusRepository;
import lk.wnl.wijeya.service.ProductDesignStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductDesignStatusServiceIMPL implements ProductDesignStatusService {

    private final ObjectMapper objectMapper;
    private final ProductDesignStatusRepository productDesignStatusRepository;

    @Override
    public List<ProductDesignStatusDto> getAll() {
        List<ProductDesignStatus> productDesignStatuses = productDesignStatusRepository.findAll();
        return objectMapper.toProductDesignStatusDtoList(productDesignStatuses);
    }
}
