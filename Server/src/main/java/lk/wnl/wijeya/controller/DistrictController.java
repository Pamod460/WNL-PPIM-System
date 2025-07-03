package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.DistrictDto;
import lk.wnl.wijeya.service.DistrictService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/districts")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictService districtService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<DistrictDto> get() {
        return districtService.getAll();
    }

}


