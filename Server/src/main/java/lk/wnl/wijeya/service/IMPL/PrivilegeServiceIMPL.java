package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PrivilegeDto;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PrivilegeRepository;
import lk.wnl.wijeya.service.PrivilegeService;
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
public class PrivilegeServiceIMPL implements PrivilegeService {
    private final PrivilegeRepository privilegeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<Privilege> getAll(HashMap<String, String> params) {
        List<Privilege> privileges = privilegeRepository.findAll();

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

    @Override
    public ResponseEntity<StandardResponse> save(PrivilegeDto privilegeDto) {
        Privilege privilege = objectMapper.toPrivilage(privilegeDto);
        if (privilegeRepository.existsByRoleAndModuleAndOperation(privilege.getRole(), privilege.getModule(), privilege.getOperation())) {
            throw new ResourceAlreadyExistException("Privilege Already Exists");
        }

        Privilege savedPrivilege = privilegeRepository.save(privilege);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Privilege Added Successfully", savedPrivilege));
    }

    @Override
    public ResponseEntity<StandardResponse> update(PrivilegeDto privilegeDto) {
        Privilege privilege = objectMapper.toPrivilage(privilegeDto);
        Privilege existingPrivilege = privilegeRepository.findById(privilege.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Privilege Not Found"));

        if (privilegeRepository.existsByRoleAndModuleAndOperationAndIdNot(
                privilege.getRole(), privilege.getModule(), privilege.getOperation(), privilege.getId())) {
            throw new ResourceAlreadyExistException("Privilege Already Exists");
        }

        Privilege updatedPrivilege = privilegeRepository.save(privilege);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Privilege Updated Successfully", updatedPrivilege));
    }

    @Override
    public ResponseEntity<StandardResponse> delete(Integer id) {
        Privilege privilege = privilegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Privilege Not Found"));

        privilegeRepository.delete(privilege);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "Privilege Successfully Deleted",null));}
    }

