package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialRepository;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MaterialServiceIMPL implements MaterialService {
    private final MaterialRepository materialRepository;
    private final ObjectMapper objectMapper;

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
            mstream = mstream.filter(m -> m.getMaterialsubcategory().getId() == Integer.parseInt(materialsubcategoryid));
        if (materialstatusid != null)
            mstream = mstream.filter(m -> m.getMaterialstatus().getId() == Integer.parseInt(materialstatusid));
        if (code != null) mstream = mstream.filter(m -> m.getCode().equals(code));
        if (name != null) mstream = mstream.filter(m -> m.getName().contains(name));

        return objectMapper.toMaterialDtoList(mstream.collect(Collectors.toList()));
    }

    @Override
    public List<MaterialDto> getAllList() {
        List<Material> materials = materialRepository.findAll();
        List<MaterialDto> materialsList = objectMapper.toMaterialDtoList(materials);
        materialsList = materialsList.stream().map(
                mat -> new MaterialDto(mat.getId(), mat.getName(),mat.getUnitprice())
        ).collect(Collectors.toList());
        return materialsList;
    }

    @Override
    public ResponseEntity<StandardResponse> save(MaterialDto materialDto) {
        Material material = objectMapper.toMaterial(materialDto);
        if (materialRepository.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Material Already Exists");
        }
        Material mat = materialRepository.save(material);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Material Added Successfully", new Material(mat.getId(), mat.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> update(MaterialDto materialDto) {
        Material material = objectMapper.toMaterial(materialDto);
        Material emprec = materialRepository.findById(material.getId()).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));

        if (!emprec.getCode().equals(material.getCode()) && materialRepository.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        Material mat = this.materialRepository.save(material);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Material Updated Successfully",
                        new Material(mat.getId(), mat.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> detele(Integer id) {
        Material material = materialRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));
        materialRepository.delete(material);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Material Deleted Successfully", null));
    }

}
