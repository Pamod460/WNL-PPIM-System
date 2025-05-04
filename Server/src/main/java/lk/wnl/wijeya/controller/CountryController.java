package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.CountryDto;
import lk.wnl.wijeya.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<CountryDto> get() {
        return countryService.getAllCountries();
    }

}


