package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.repository.SupplierTypeRepository;
import lk.wnl.wijeya.entity.SupplierType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliertypes")
public class SupplierTypeController {

    @Autowired
    private SupplierTypeRepository supplierTypeRepository;

    @GetMapping(path = "/list", produces = "application/json")
    public List<SupplierType> get() {
        return supplierTypeRepository.findAll();
    }
}


