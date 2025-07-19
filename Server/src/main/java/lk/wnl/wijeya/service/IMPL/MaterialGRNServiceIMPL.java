package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialGrnDto;
import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.entity.MaterialGrnMaterial;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialGRNRepository;
import lk.wnl.wijeya.repository.SupplierPaymentRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.MaterialGRNService;
import lk.wnl.wijeya.service.MaterialPorderService;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MaterialGRNServiceIMPL implements MaterialGRNService {
    private final MaterialGRNRepository materialGRNRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final MaterialService materialService;
    private final SupplierPaymentRepository supplierPaymentRepository;
    private final MaterialPorderService materialPorderService;

    @Override
    public List<MaterialGrnDto> getAll() {
        return objectMapper.toMaterialGrnDtoList(materialGRNRepository.findAll());
    }

    @Override
    public List<MaterialGrnDto> getAllMaterialGrns(HashMap<String, String> params, String authHeader) {
        List<MaterialGrn> materialGrns = materialGRNRepository.findAll();


        if (!params.isEmpty()) {
            String ponumber = params.get("ponumber");
            String date = params.get("date");
            String mpstatusid = params.get("mgrnstatusid");

            Stream<MaterialGrn> mpostream = materialGrns.stream();

            if (mpstatusid != null)
                mpostream = mpostream.filter(m -> m.getMaterialGrnStatus().getId() == Integer.parseInt(mpstatusid));
            if (date != null)
                mpostream = mpostream.filter(m -> m.getDate().equals(LocalDate.parse(date)));
            if (ponumber != null)
                mpostream = mpostream.filter(m -> m.getCode().equals(ponumber));

            materialGrns = mpostream.collect(Collectors.toList());
        }

        return objectMapper.toMaterialGrnDtoList(materialGrns);

    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String codePrefix = textPart.toUpperCase() + datePart + "-";
        MaterialGrn lastMaterialGrn = materialGRNRepository.findTopByCodeStartsWithOrderByCodeDesc(codePrefix);

        int nextNumber = 1;
        if (lastMaterialGrn != null && lastMaterialGrn.getCode().length() > codePrefix.length()) {
            try {
                String numberPart = lastMaterialGrn.getCode().substring(codePrefix.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }
        String nextCode = codePrefix + String.format("%02d", nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }


    @Override
    public ResponseEntity<StandardResponse> saveMaterialGrn(MaterialGrnDto materialGrnDto) {
        User loggeruser = userRepository.findByUsername(materialGrnDto.getLogger());
        MaterialGrn materialPoder = objectMapper.toMaterialGrn(materialGrnDto);
        materialPoder.setCreatedBy(loggeruser);
        if (materialGRNRepository.existsByCode(materialPoder.getCode())) {
            throw new ResourceAlreadyExistException("GRN Already Exists");
        }
        for (MaterialGrnMaterial m : materialPoder.getMaterialGrnMaterials()) m.setMaterialGrn(materialPoder);
        materialPoder.getMaterialGrnMaterials().forEach(m -> {
            this.materialService.increaseQuantity(m.getMaterial().getId(), BigDecimal.valueOf(m.getQuantity()));
        });
        materialPorderService.updatePorderReceivingStatus(materialGrnDto.getMaterialPorder().getId());

        MaterialGrn savedMGrn = materialGRNRepository.save(materialPoder);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("GRN Added Successfully", new MaterialGrnDto(savedMGrn.getId(), savedMGrn.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateMaterialGrn(MaterialGrnDto materialGrnDto) {
        MaterialGrn materialGrn = objectMapper.toMaterialGrn(materialGrnDto);
        MaterialGrn extMaterialGrn = materialGRNRepository.findById(materialGrn.getId()).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));
        materialGrn.setCreatedBy(extMaterialGrn.getCreatedBy());


        if (!extMaterialGrn.getCode().equals(materialGrn.getCode()) && materialGRNRepository.existsByCode(materialGrn.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        for (MaterialGrnMaterial m : materialGrn.getMaterialGrnMaterials()) m.setMaterialGrn(materialGrn);
        MaterialGrn updatedMGrn = materialGRNRepository.save(materialGrn);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "Material Updated Successfully",
                        new MaterialGrnDto(updatedMGrn.getId(), updatedMGrn.getCode())));


    }

    @Override
    public ResponseEntity<StandardResponse> deleteMaterialGrn(Integer id) {
        MaterialGrn materialGrn = materialGRNRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("GRN Not Found"));
        if (supplierPaymentRepository.existsBySupplierPaymentGrns_MaterialGrn(materialGrn)) {
            throw new ResourceAlreadyExistException("Cannot delete GRN because a payment has already been made.");
        }
        materialGRNRepository.delete(materialGrn);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(), "GRN Deleted Successfully", null));


    }
}
