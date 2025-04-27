package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.SupplierDao;
import lk.wnl.wijeya.entity.Supplier;
import lk.wnl.wijeya.entity.Supply;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/suppliers")
public class SupplierController {


    private final SupplierDao supplierDao;

    @GetMapping(path = "/list", produces = "application/json")
    public List<Supplier> get() {
        return supplierDao.findAll();
    }

    @GetMapping(produces = "application/json")
    public List<Supplier> get(@RequestParam HashMap<String, String> params) {

        List<Supplier> suppliers = this.supplierDao.findAll();

        if (params.isEmpty()) return suppliers;

        String number = params.get("number");
        String typeid = params.get("type");
        String name = params.get("name");
        String statusid = params.get("status");
        String materialid = params.get("material");

        Stream<Supplier> supplierStream = suppliers.stream();

        if (statusid != null)
            supplierStream = supplierStream.filter(s -> s.getSupplierstatus().getId() == Integer.parseInt(statusid));
        if (typeid != null)
            supplierStream = supplierStream.filter(s -> s.getSuppliertype().getId() == Integer.parseInt(typeid));
        if (number != null) supplierStream = supplierStream.filter(s -> s.getRegNo().equals(number));
        if (materialid != null)
            supplierStream = supplierStream.filter(s -> s.getSupplies().stream().anyMatch(ms -> ms.getMaterial().getId() == Integer.parseInt(materialid)));
        if (name != null) supplierStream = supplierStream.filter(s -> s.getName().contains(name));

        return supplierStream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody Supplier supplier) {
        if (supplierDao.existsByName(supplier.getName()))
            throw new ResourceAlreadyExistException("Existing Supplier");

        if (supplierDao.existsByAccontHolderAndBankAccNoAndIdNot(supplier.getAccontHolder(), supplier.getBankAccNo(),supplier.getId())) {
            throw new ResourceAlreadyExistException("Bank Account Already Exists");
        }
        for (Supply s : supplier.getSupplies()) s.setSupplier(supplier);

        Supplier sup = supplierDao.save(supplier);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Supplier Added Successfully",
                        new Supplier(sup.getId(), sup.getName())));
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody Supplier supplier) {
        Supplier existingSupplier = supplierDao.findById(supplier.getId()).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));

        if (supplierDao.existsByAccontHolderAndBankAccNoAndIdNot(supplier.getAccontHolder(), supplier.getBankAccNo(),supplier.getId())) {
            throw new ResourceAlreadyExistException("Bank Account Already Exists");
        }

        try {
            existingSupplier.getSupplies().clear();
            supplier.getSupplies().forEach(newSupplies -> {
                newSupplies.setSupplier(existingSupplier);
                existingSupplier.getSupplies().add(newSupplies);
            });
            BeanUtils.copyProperties(supplier, existingSupplier, "id", "supplies");
            Supplier updatedSupplier = supplierDao.save(existingSupplier);

            return ResponseEntity.ok(new StandardResponse(
                    HttpStatus.OK.value(), "Supplier Updated Successfully", new Supplier(updatedSupplier.getId(), updatedSupplier.getName())
            ));
        } catch (Exception e) {
            throw new RuntimeException("Error updating supplier : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        Supplier existingSupplier = supplierDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));
        supplierDao.delete(existingSupplier);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Supplier Successfully Deleted", null));
    }
}


