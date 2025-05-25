package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.VehicleModelDto;
import lk.wnl.wijeya.entity.VehicleModel;
import lk.wnl.wijeya.repository.VehicleModelRepository;
import lk.wnl.wijeya.service.VehicleModelService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VehicleModelServiceIMPL implements VehicleModelService {

    private final VehicleModelRepository vehicleModelRepository;
    private final ObjectMapper modelMapper;

    @Override
    public List<VehicleModelDto> getAll() {
        List<VehicleModel> vehicleModelList = vehicleModelRepository.findAll();
            return modelMapper.vehicleModelListToDtoList(vehicleModelList);

    }
}
