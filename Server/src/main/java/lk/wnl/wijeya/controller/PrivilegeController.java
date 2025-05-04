package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PrivilegeDto;
import lk.wnl.wijeya.repository.PrivilegeRepository;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.service.PrivilegeService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class PrivilegeController {
private final PrivilegeService privilegeService;


    @GetMapping(produces = "application/json")
    public List<Privilege> get(@RequestParam HashMap<String, String> params) {
        return privilegeService.getAll(params);

    }

    @PostMapping
    public ResponseEntity<StandardResponse> add(@RequestBody PrivilegeDto privilege) {
        return privilegeService.save(privilege);

    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PrivilegeDto privilegeDto) {
        return privilegeService.update(privilegeDto);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return privilegeService.delete(id);

}}
