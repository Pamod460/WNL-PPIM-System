package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.PrivilegeDao;
import lk.wnl.wijeya.entity.Privilege;
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
@RequestMapping(value = "/privileges")
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    @GetMapping(produces = "application/json")
    public List<Privilege> get(@RequestParam HashMap<String, String> params) {
        List<Privilege> privileges = privilegeDao.findAll();

        if (params.isEmpty()) return privileges;

        String roleId = params.get("roleid");
        String moduleId = params.get("moduleid");
        String operationId = params.get("operationid");

        Stream<Privilege> pstream = privileges.stream();

        if (roleId != null) pstream = pstream.filter(p -> p.getRole().getId() == Integer.parseInt(roleId));
        if (moduleId != null) pstream = pstream.filter(p -> p.getModule().getId() == Integer.parseInt(moduleId));
        if (operationId != null) pstream = pstream.filter(p -> p.getOperation().getId() == Integer.parseInt(operationId));

        return pstream.collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<StandardResponse> add(@RequestBody Privilege privilege) {
        if (privilegeDao.existsByRoleAndModuleAndOperation(privilege.getRole(), privilege.getModule(), privilege.getOperation())) {
            throw new ResourceAlreadyExistException("Privilege Already Exists");
        }

        Privilege savedPrivilege = privilegeDao.save(privilege);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Privilege Added Successfully", savedPrivilege));
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody Privilege privilege) {
        Privilege existingPrivilege = privilegeDao.findById(privilege.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Privilege Not Found"));

        if (privilegeDao.existsByRoleAndModuleAndOperationAndIdNot(
                privilege.getRole(), privilege.getModule(), privilege.getOperation(), privilege.getId())) {
            throw new ResourceAlreadyExistException("Privilege Already Exists");
        }

        Privilege updatedPrivilege = privilegeDao.save(privilege);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Privilege Updated Successfully", updatedPrivilege));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        Privilege privilege = privilegeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Privilege Not Found"));

        privilegeDao.delete(privilege);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Privilege Successfully Deleted",null));}
}
