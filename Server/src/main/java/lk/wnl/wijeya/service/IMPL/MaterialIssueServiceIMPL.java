package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialIssueDto;
import lk.wnl.wijeya.entity.IssuedMaterial;
import lk.wnl.wijeya.entity.MaterialIssue;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialIssueRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.MaterialIssueService;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.service.ProductionOrderService;
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
public class MaterialIssueServiceIMPL implements MaterialIssueService {
    private final MaterialIssueRepository materialIssueRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final MaterialService materialService;
    private final ProductionOrderService productionOrderService;

    @Override
    public List<MaterialIssueDto> getAll() {
        return objectMapper.toMaterialIssueDtoList(materialIssueRepository.findAll());
    }

    @Override
    public List<MaterialIssueDto> getAllMaterialIssues(HashMap<String, String> params) {
        List<MaterialIssue> MaterialIssues = this.materialIssueRepository.findAll();

        if (params.isEmpty()) {

            return objectMapper.toMaterialIssueDtoList(MaterialIssues);
        }
        Stream<MaterialIssue> stream = MaterialIssues.stream();

        String code = params.get("code");
        String issuedDate = params.get("issuedDate");
//            String fullname = params.get("fullname");

        if (code != null) stream = stream.filter(a -> a.getCode().equalsIgnoreCase(code));
        if (issuedDate != null) {
            LocalDate issued = LocalDate.parse(issuedDate);
            stream = stream.filter(a -> a.getIssuedDate().equals(issued));
        }

//            if (fullname != null) stream = stream.filter(a -> a.getFullName().toLowerCase().contains(fullname.toLowerCase()));

        return objectMapper.toMaterialIssueDtoList(stream.collect(Collectors.toList()));

    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode() {
        MaterialIssue lastOrder = materialIssueRepository.findTopByOrderByIdDesc();

        int nextNumber = (lastOrder != null) ? lastOrder.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode = String.format("MIS-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<StandardResponse> saveMaterialIssue(MaterialIssueDto MaterialIssueDto) {
        MaterialIssue materialIssue = objectMapper.toMaterialIssue(MaterialIssueDto);
        materialIssue.setCreatedBy(userRepository.findByUsername(MaterialIssueDto.getLogger()));
        if (materialIssueRepository.existsByCode(materialIssue.getCode())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }

        for (IssuedMaterial issuedMaterial : materialIssue.getIssuedMaterials()) {
            issuedMaterial.setMaterialIssue(materialIssue);
            materialService.decreaseQuantity(issuedMaterial.getMaterial().getId(), BigDecimal.valueOf(issuedMaterial.getQuantity()));
        }

        productionOrderService.updateProductionOrderStatus(materialIssue.getProductionOrder().getId(), 2);
        MaterialIssue savedMaterialIssue = materialIssueRepository.save(materialIssue);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Material Issue Added Successfully",
                        new MaterialIssueDto(savedMaterialIssue.getId(), savedMaterialIssue.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateMaterialIssue(MaterialIssueDto materialIssueDto) {
        MaterialIssue materialIssue = objectMapper.toMaterialIssue(materialIssueDto);
        MaterialIssue extMaterialIssue = materialIssueRepository.findById(materialIssue.getId()).orElseThrow(() -> new ResourceNotFoundException("Material Issue not found"));
        materialIssue.setCreatedBy(extMaterialIssue.getCreatedBy());
        if (materialIssueRepository.existsByCodeAndIdNot(materialIssue.getCode(), materialIssue.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        for (IssuedMaterial issuedMaterial : materialIssue.getIssuedMaterials()) {
            issuedMaterial.setMaterialIssue(materialIssue);
        }

        MaterialIssue savedMaterialIssue = materialIssueRepository.save(materialIssue);
        return ResponseEntity.ok(new StandardResponse(200, "Material Issue Updated Successfully", new MaterialIssueDto(savedMaterialIssue.getId(), savedMaterialIssue.getCode())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteMaterialIssue(Integer id) {
        MaterialIssue MaterialIssue = materialIssueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Material Issue Not Found"));

        materialIssueRepository.delete(MaterialIssue);
        return new ResponseEntity<>(new StandardResponse(200, "Material Issue Deleted Successfully", null), HttpStatus.OK);
    }
}
