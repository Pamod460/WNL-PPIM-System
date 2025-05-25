package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dto.VehicleTypeDto;
import lk.wnl.wijeya.service.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/vehicletypes")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    public List<VehicleTypeDto> getAll(){
        return vehicleTypeService.getAll();
    }
}
