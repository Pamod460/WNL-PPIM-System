package lk.wnl.wijeya.service;





import lk.wnl.wijeya.dto.VehicleDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;


public interface VehicleService {
    List<VehicleDto> getVehicles(HashMap<String, String> params);

    ResponseEntity<StandardResponse> saveVehicle(VehicleDto vehicleDTO);

    ResponseEntity<StandardResponse> updateVehicle(VehicleDto vehicleDTO);

    ResponseEntity<StandardResponse> deleteVehicle(Integer id);
}
