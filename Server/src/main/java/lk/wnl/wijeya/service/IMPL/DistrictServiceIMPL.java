package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.DistrictDto;
import lk.wnl.wijeya.entity.District;
import lk.wnl.wijeya.repository.DistrictRepository;
import lk.wnl.wijeya.service.DistrictService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DistrictServiceIMPL implements DistrictService {
    private final DistrictRepository districtRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DistrictDto> getAll() {
        List<District> districtList = districtRepository.findAll();
        return objectMapper.toDistrictDtoList(districtList);
    }
}
