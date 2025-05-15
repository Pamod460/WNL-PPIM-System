package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.service.EmployeeService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping(produces = "application/json")
    public List<EmployeeDto> get(@RequestParam HashMap<String, String> params) {
        return employeeService.getAllEmployees(params);
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<EmployeeDto> get() {
        return employeeService.getAllEmployees();
    }

    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastEmployee() {
        return employeeService.getLastEmployeeCode();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody EmployeeDto employeeDto) {
        return employeeService.saveEmployee(employeeDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody EmployeeDto employee) {
        return employeeService.UpdateEmployee(employee);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return employeeService.deleteEmployee(id);
    }

}