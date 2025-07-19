package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.SupplierPaymentDto;
import lk.wnl.wijeya.entity.SupplierPayment;
import lk.wnl.wijeya.entity.SupplierPaymentGrn;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.SupplierPaymentRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.SupplierPaymentService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SupplierPaymentServiceIMPL implements SupplierPaymentService {

    private final ObjectMapper objectMapper;
    private final SupplierPaymentRepository supplierPaymentRepository;
    private final UserRepository userRepository;
    @Override
    public ResponseEntity<StandardResponse> delete(Integer id) {
        SupplierPayment existingSupplierPayment = supplierPaymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier Payment Not Found"));
        supplierPaymentRepository.delete(existingSupplierPayment);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Supplier Payment Successfully Deleted", null));
    }

    @Override
    public ResponseEntity<StandardResponse> update(SupplierPaymentDto supplierPaymentDto) {
        SupplierPayment extSupplierPayment = supplierPaymentRepository.findById(supplierPaymentDto.getId()).orElseThrow(() -> new ResourceNotFoundException("Supplier Payment Not Found"));

        User user = userRepository.findByUsername(extSupplierPayment.getLogger());
        SupplierPayment supplierPayment = objectMapper.toSupplierPayment(supplierPaymentDto);
        supplierPayment.setCreatedBy(user);

        if (supplierPaymentRepository.existsByReferenceNoAndIdNot(supplierPayment.getReferenceNo(), supplierPayment.getId()))
            throw new ResourceAlreadyExistException("Existing Reference No");

        for (SupplierPaymentGrn s : supplierPayment.getSupplierPaymentGrns()) s.setSupplierPayment(supplierPayment);

        SupplierPayment supPayment = supplierPaymentRepository.save(supplierPayment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Supplier Updated Successfully",
                        new SupplierPaymentDto(supPayment.getId(), supPayment.getReferenceNo())));
    }

    @Override
    public List<SupplierPaymentDto> getAll(HashMap<String, String> params) {
        List<SupplierPayment> supplierPayments = this.supplierPaymentRepository.findAll();

        if (params.isEmpty()) return objectMapper.tosupplierPaymentDtoList(supplierPayments);

        String supplier = params.get("supplier");
        String referenceno = params.get("referenceno");
        String date = params.get("date");
        String paymentstatus = params.get("paymentstatus");

        Stream<SupplierPayment> supplierPaymentStream = supplierPayments.stream();

        if (supplier != null)
            supplierPaymentStream = supplierPaymentStream.filter(s -> s.getSupplier().getId() == Integer.parseInt(supplier));
        if (referenceno != null)
            supplierPaymentStream = supplierPaymentStream.filter(s -> s.getReferenceNo().equals(referenceno));
        if (date != null) supplierPaymentStream = supplierPaymentStream.filter(s -> s.getDate().equals(LocalDate.parse(date)));
        if (paymentstatus != null)
            supplierPaymentStream = supplierPaymentStream.filter(s -> s.getPaymentStatus().getId() == Integer.parseInt(paymentstatus));

        return objectMapper.toSupplierPaymentDtoList(supplierPaymentStream.collect(Collectors.toList()));
    }



    @Override
    public ResponseEntity<StandardResponse> save(SupplierPaymentDto supplierPaymentDto) {
        User user = userRepository.findByUsername(supplierPaymentDto.getLogger());
        SupplierPayment supplierPayment = objectMapper.toSupplierPayment(supplierPaymentDto);
        supplierPayment.setCreatedBy(user);

        if (supplierPaymentRepository.existsByReferenceNo(supplierPayment.getReferenceNo()))
            throw new ResourceAlreadyExistException("Existing Reference No");

        for (SupplierPaymentGrn s : supplierPayment.getSupplierPaymentGrns()) s.setSupplierPayment(supplierPayment);

        SupplierPayment supPayment = supplierPaymentRepository.save(supplierPayment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Supplier Added Successfully",
                        new SupplierPaymentDto(supPayment.getId(), supPayment.getReferenceNo())));
    }
    @Override
    public ResponseEntity<Map<String, String>> getNextCode() {
        SupplierPayment lastPayment = supplierPaymentRepository.findTopByOrderByIdDesc();

        int nextNumber = (lastPayment != null) ? lastPayment.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode= String.format("SP-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

}
