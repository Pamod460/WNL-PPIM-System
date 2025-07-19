package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialRepository;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.service.UserService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MaterialServiceIMPL implements MaterialService {
    private final MaterialRepository materialRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;

    @Override
    public List<MaterialDto> getAllList(HashMap<String, String> params) {
        List<Material> materials = materialRepository.findAll();
        if (params.isEmpty()) return objectMapper.toMaterialDtoList(materials);

        String code = params.get("code");
        String name = params.get("name");
        String materialstatusid = params.get("materialstatusid");
        String materialsubcategoryid = params.get("materialsubcategoryid");


        Stream<Material> mstream = materials.stream();

        if (materialsubcategoryid != null)
            mstream = mstream.filter(m -> m.getMaterialSubcategory().getId() == Integer.parseInt(materialsubcategoryid));
        if (materialstatusid != null)
            mstream = mstream.filter(m -> m.getMaterialStatus().getId() == Integer.parseInt(materialstatusid));
        if (code != null) mstream = mstream.filter(m -> m.getCode().equals(code));
        if (name != null) mstream = mstream.filter(m -> m.getName().contains(name));

        return objectMapper.toMaterialDtoList(mstream.collect(Collectors.toList()));
    }

    @Override
    public List<MaterialDto> getAllList() {
        List<Material> materials = materialRepository.findAll();
        List<MaterialDto> materialsList = objectMapper.toMaterialDtoList(materials);
        materialsList = materialsList.stream().map(
                mat -> new MaterialDto(mat.getId(), mat.getName(), mat.getUnitPrice())
        ).collect(Collectors.toList());
        return materialsList;
    }

    @Override
    public ResponseEntity<StandardResponse> save(MaterialDto materialDto) {
        User user = userService.getUserByUsername(materialDto.getLogger());
        Material material = objectMapper.toMaterial(materialDto);
        material.setCreatedBy(user);

        if (materialRepository.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Material Already Exists");
        }
        Material mat = materialRepository.save(material);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Material Added Successfully", new MaterialDto(mat.getId(), mat.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> update(MaterialDto materialDto) {
        Material material = objectMapper.toMaterial(materialDto);
        Material extMaterial = materialRepository.findById(material.getId()).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));
        material.setCreatedBy(extMaterial.getCreatedBy());
        if (!extMaterial.getCode().equals(material.getCode()) && materialRepository.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        Material mat = this.materialRepository.save(material);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Material Updated Successfully",
                        new MaterialDto(mat.getId(), mat.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> detele(Integer id) {
        Material material = materialRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));
        materialRepository.delete(material);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Material Deleted Successfully", material.getId()));
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        Material lastMaterial = materialRepository.findTopByCodeStartingWithOrderByCodeDesc(textPart);

        int nextNumber = 1;
        if (lastMaterial != null && lastMaterial.getCode().length() > textPart.length()) {
            try {
                String numberPart = lastMaterial.getCode().substring(textPart.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }

        String nextCode = textPart.toUpperCase() + String.format("%03d", nextNumber); // e.g., WP0001

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    @Transactional
    public void increaseQuantity(Integer id, BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Quantity must be a non-negative value");
        }

        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with ID: " + id));

        BigDecimal newQuantity = material.getQuantity().add(quantity);
        if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Quantity cannot be negative");
        }

        material.setQuantity(newQuantity);
        materialRepository.save(material);
    }
    @Override
    @Transactional
    public void decreaseQuantity(Integer id, BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Quantity must be a non-negative value");
        }

        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with ID: " + id));

        BigDecimal newQuantity = material.getQuantity().subtract(quantity);
        if (newQuantity.compareTo(material.getRop()) < 0) {
            throw new IllegalStateException("Quantity cannot be reduced below the reorder point: " + material.getRop());
        }

        material.setQuantity(newQuantity);
        materialRepository.save(material);
    }
}
