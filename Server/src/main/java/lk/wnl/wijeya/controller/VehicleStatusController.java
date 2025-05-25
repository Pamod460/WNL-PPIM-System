package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.VehicleStatusDto;
import lk.wnl.wijeya.service.VehicleStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/vehiclestatuses")
@RequiredArgsConstructor
public class VehicleStatusController {

    private final VehicleStatusService vehicleStatusService;

    @GetMapping
    public List<VehicleStatusDto> getAll(){
        return vehicleStatusService.getAll();
    }
}
