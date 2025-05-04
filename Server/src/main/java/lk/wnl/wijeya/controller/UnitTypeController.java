package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.repository.UnittypeRepository;
import lk.wnl.wijeya.entity.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/unittypes")
public class UnitTypeController {

    @Autowired
    private UnittypeRepository unittypeRepository;

    @GetMapping(produces = "application/json")
    public List<UnitType> get() {
        return this.unittypeRepository.findAll();
    }

}


