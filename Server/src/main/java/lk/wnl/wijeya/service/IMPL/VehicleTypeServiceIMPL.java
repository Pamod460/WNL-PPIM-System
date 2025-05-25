package lk.wnl.wijeya.service.IMPL;



import lk.wnl.wijeya.dto.VehicleTypeDto;
import lk.wnl.wijeya.entity.VehicleType;
import lk.wnl.wijeya.repository.VehicleTypeRepository;
import lk.wnl.wijeya.service.VehicleTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VehicleTypeServiceIMPL implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final ObjectMapper modelMapper;

    @Override
    public List<VehicleTypeDto> getAll() {
        List<VehicleType> vehicletypes = vehicleTypeRepository.findAll();


            List<VehicleTypeDto> vehicleTypeDtoList = modelMapper.vehicleTypeListToDtoList(vehicletypes);
            return vehicleTypeDtoList;

    }
}
