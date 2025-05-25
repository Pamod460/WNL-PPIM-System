package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.VehicleDto;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Vehicle;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.repository.VehicleRepository;
import lk.wnl.wijeya.service.VehicleService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
@RequiredArgsConstructor
public class VehicleServiceIMPL implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ObjectMapper modelMapper;

    @Override
    public List<VehicleDto> getVehicles(HashMap<String, String> params) {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        List<VehicleDto> vehicleDtoList = modelMapper.vehicleListToDtoList(vehicles);

        if (params.isEmpty()) {
            return vehicleDtoList;
        } else {
            String number = params.get("number");
            String vehiclestatusid = params.get("vehiclestatusid");
            String vehicletypeid = params.get("vehicletypeid");

            Stream<VehicleDto> vstreame = vehicleDtoList.stream();


            if (vehiclestatusid != null)
                vstreame = vstreame.filter(e -> e.getVehicleStatus().getId() == Integer.parseInt(vehiclestatusid));
            if (vehicletypeid != null)
                vstreame = vstreame.filter(e -> e.getVehicleType().getId() == Integer.parseInt(vehicletypeid));
            if (number != null) vstreame = vstreame.filter(e -> e.getNumber().equals(number));


            return vstreame.collect(Collectors.toList());
        }

    }

    @Override
    public ResponseEntity<StandardResponse> saveVehicle(VehicleDto vehicleDTO) {

        User user= userRepository.findByUsername(vehicleDTO.getLogger());
        if (vehicleRepository.existsByNumber(vehicleDTO.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exist!");
        }

        Vehicle vehicle = modelMapper.vehicleDtoToVehicle(vehicleDTO);
        vehicle.setCreatedBy(user);
        Vehicle savedvehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Vehicle Added Successfully",
                        new VehicleDto(savedvehicle.getId(), savedvehicle.getNumber())));

    }

    @Override
    public ResponseEntity<StandardResponse> updateVehicle(VehicleDto vehicleDTO) {
        Vehicle vh = vehicleRepository.findById(vehicleDTO.getId()).orElseThrow(() -> new ResourceNotFoundException("Vehicle Not Found!"));

        if (!vh.getNumber().equals(vehicleDTO.getNumber()) && vehicleRepository.existsByNumber(vehicleDTO.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exist!");
        }

        Vehicle vehicle = modelMapper.vehicleDtoToVehicle(vehicleDTO);
        vehicle.setCreatedBy(vh.getCreatedBy());
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Vehicle Updated Successfully",
                        new VehicleDto(updatedVehicle.getId(), updatedVehicle.getNumber())));

    }

    @Override
    public ResponseEntity<StandardResponse> deleteVehicle(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle Not Found"));
        vehicleRepository.delete(vehicle);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Vehicle Deleted Successfully", null));
    }
}
