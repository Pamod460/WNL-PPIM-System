package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.VehicleStatusDto;
import lk.wnl.wijeya.entity.VehicleStatus;
import lk.wnl.wijeya.repository.VehicleStatusRepository;
import lk.wnl.wijeya.service.VehicleStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VehicleStatusServiceIMPL implements VehicleStatusService {

    private final VehicleStatusRepository vehicleStatusRepository;
    private final ObjectMapper modelMapper;

    @Override
    public List<VehicleStatusDto> getAll() {
        List<VehicleStatus> vehiclestatuses = vehicleStatusRepository.findAll();

            List<VehicleStatusDto> vehicleStatusDtos = modelMapper.vehicleStatusListToDtoList(vehiclestatuses);
            return vehicleStatusDtos;

    }
}
