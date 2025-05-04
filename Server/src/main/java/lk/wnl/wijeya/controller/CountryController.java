package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.CountryDao;
import lk.wnl.wijeya.entity.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/countries")
public class CountryController {

    @Autowired
    private CountryDao countryDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Country> get() {

        List<Country> countries = this.countryDao.findAll();

        countries = countries.stream().map(
                country -> { Country d = new Country();
                    d.setId(country.getId());
                    d.setName(country.getName());
                    return d; }
        ).collect(Collectors.toList());

        return countries;

    }

}


