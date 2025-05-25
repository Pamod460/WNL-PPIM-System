package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.VehicleModelDto;
import lk.wnl.wijeya.service.VehicleModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/vehiclemodels")
@RequiredArgsConstructor
public class VehicleModelController {

    private final VehicleModelService vehicleModelService;

    @GetMapping
    public List<VehicleModelDto> getAll(){
        return vehicleModelService.getAll();
    }
}
