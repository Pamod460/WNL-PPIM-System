package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.MaterialDao;
import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/materials")
public class MaterialController {

    @Autowired
    private MaterialDao materialDao;

    @GetMapping(produces = "application/json")
    public List<Material> get(@RequestParam HashMap<String, String> params) {
        List<Material> materials = this.materialDao.findAll();

        if (params.isEmpty()) return materials;

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

        return mstream.collect(Collectors.toList());

    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<StandardResponse> save(@RequestBody Material material) {
        if (materialDao.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }
        Material mat = materialDao.save(material);
        return new ResponseEntity<StandardResponse>(new StandardResponse(201, "Material Added Successfully", new Material(mat.getId(), mat.getName())), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public ResponseEntity<StandardResponse> update(@RequestBody Material material) {
        Material emprec = materialDao.findById(material.getId()).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));

        if (!emprec.getCode().equals(material.getCode()) && materialDao.existsByCode(material.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        Material mat = this.materialDao.save(material);
        return new ResponseEntity<StandardResponse>(new StandardResponse(201, "Material Added Successfully", new Material(mat.getId(), mat.getName())), HttpStatus.CREATED);

    }

    @DeleteMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        Material material = materialDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Material Not Found"));
        materialDao.delete(material);
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200, "Successfully Deleted", null), HttpStatus.OK
        );


    }

}


