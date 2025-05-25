package lk.wnl.wijeya.controller;



import lk.wnl.wijeya.dto.VehicleDto;
import lk.wnl.wijeya.service.VehicleService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public List<VehicleDto> getVehicles(@RequestParam HashMap<String,String> params){
        return vehicleService.getVehicles(params);
    }

    @PostMapping
    public ResponseEntity<StandardResponse> save(@RequestBody VehicleDto vehicleDTO){
        return vehicleService.saveVehicle(vehicleDTO);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody VehicleDto vehicleDTO){
        return vehicleService.updateVehicle(vehicleDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        return vehicleService.deleteVehicle(id);
    }


}
