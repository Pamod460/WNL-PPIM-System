package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.repository.SupplierStatusRepository;
import lk.wnl.wijeya.entity.SupplierStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierstatuss")
public class SupplierStatusController {

    @Autowired
    private SupplierStatusRepository supplierStatusRepository;

    @GetMapping(path = "/list", produces = "application/json")
    public List<SupplierStatus> get() {
        return supplierStatusRepository.findAll();
    }
}


