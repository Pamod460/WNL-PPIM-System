package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.SupplierDto;
import lk.wnl.wijeya.entity.PaperSupply;
import lk.wnl.wijeya.entity.Supplier;
import lk.wnl.wijeya.entity.Supply;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.SupplierRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.SupplierService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SupplierServiceIMPL implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<StandardResponse> delete(Integer id) {
        Supplier existingSupplier = supplierRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));
        supplierRepository.delete(existingSupplier);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Supplier Successfully Deleted", null));
    }

    @Override
    public ResponseEntity<StandardResponse> update(SupplierDto supplierDto) {
        Supplier supplier = objectMapper.toSupplier(supplierDto);
        Supplier existingSupplier = supplierRepository.findById(supplier.getId()).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));
        supplier.setCreatedBy(existingSupplier.getCreatedBy());
        if (supplierRepository.existsByAccontHolderAndBankAccNoAndIdNot(supplier.getAccontHolder(), supplier.getBankAccNo(), supplier.getId())) {
            throw new ResourceAlreadyExistException("Bank Account Already Exists");
        }

        try {
            existingSupplier.getSupplies().clear();
            existingSupplier.getPaperSupplies().clear();
            supplier.getSupplies().forEach(newSupplies -> {
                newSupplies.setSupplier(existingSupplier);
                existingSupplier.getSupplies().add(newSupplies);
            });

            supplier.getPaperSupplies().forEach(newPaperSupplies -> {
                newPaperSupplies.setPaperSupplier(existingSupplier);
                existingSupplier.getPaperSupplies().add(newPaperSupplies);
            });
            BeanUtils.copyProperties(supplier, existingSupplier, "id", "supplies", "paperSupplies", "createdBy");
            Supplier updatedSupplier = supplierRepository.save(existingSupplier);

            return ResponseEntity.ok(new StandardResponse(
                    HttpStatus.OK.value(), "Supplier Updated Successfully", new SupplierDto(updatedSupplier.getId(), updatedSupplier.getName())
            ));
        } catch (Exception e) {
            throw new RuntimeException("Error updating supplier : " + e.getMessage());
        }
    }

    @Override
    public List<SupplierDto> getAll() {
        return objectMapper.toSupplierDtoList(supplierRepository.findAll());
    }

    @Override
    public List<SupplierDto> getAll(HashMap<String, String> params) {
        List<Supplier> suppliers = this.supplierRepository.findAll();

        if (params.isEmpty()) return objectMapper.toSupplierDtoList(suppliers);

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
            supplierStream = supplierStream.filter(s -> s.getSupplies().stream().anyMatch(ms -> ms.getMaterialSubcategory().getMaterials().stream().anyMatch(m -> m.getId() == Integer.parseInt(materialid))));
        if (name != null) supplierStream = supplierStream.filter(s -> s.getName().contains(name));

        return objectMapper.toSupplierDtoList(supplierStream.collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<Map<String, String>> getLastSupplier() {
        String code;
        Supplier supplier = supplierRepository.findTopByOrderByIdDesc();

        int no = (supplier != null) ? Integer.parseInt(supplier.getRegNo().substring(1)) + 1 : 1;

        if (no < 10) {
            code = "S00" + no;
        } else if (no < 100) {
            code = "S0" + no;
        } else {
            code = "S" + no;
        }

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<StandardResponse> save(SupplierDto supplierDto) {
        User user = userRepository.findByUsername(supplierDto.getLogger());
        Supplier supplier = objectMapper.toSupplier(supplierDto);
        supplier.setCreatedBy(user);

        if (supplierRepository.existsByName(supplier.getName()))
            throw new ResourceAlreadyExistException("Existing Supplier");

        if (supplierRepository.existsByAccontHolderAndBankAccNoAndIdNot(supplier.getAccontHolder(), supplier.getBankAccNo(), supplier.getId())) {
            throw new ResourceAlreadyExistException("Bank Account Already Exists");
        }
        for (Supply s : supplier.getSupplies()) s.setSupplier(supplier);
        for (PaperSupply ps : supplier.getPaperSupplies()) ps.setPaperSupplier(supplier);

        Supplier sup = supplierRepository.save(supplier);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Supplier Added Successfully",
                        new SupplierDto(sup.getId(), sup.getName())));
    }
}
