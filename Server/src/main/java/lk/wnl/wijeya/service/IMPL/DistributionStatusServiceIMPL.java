package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.DistributionStatusDto;
import lk.wnl.wijeya.entity.DistributionStatus;
import lk.wnl.wijeya.repository.DistributionStatusRepository;
import lk.wnl.wijeya.service.DistributionStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DistributionStatusServiceIMPL implements DistributionStatusService {

    private final ObjectMapper objectMapper;
    private final DistributionStatusRepository distributionStatusRepository;
    @Override
    public List<DistributionStatusDto> getAllDistributionStatuses() {
        List<DistributionStatus> distributionStatusList = this.distributionStatusRepository.findAll();
        return objectMapper.toDistributionStatusDtoList(distributionStatusList);
    }
}
