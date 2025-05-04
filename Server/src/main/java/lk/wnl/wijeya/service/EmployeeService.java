package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface EmployeeService {
    List<EmployeeDto> getAllEmployees(HashMap<String, String> params);
    List<EmployeeDto> getAllEmployees();

    ResponseEntity<Map<String, String>> getLastEmployeeCode();

    ResponseEntity<StandardResponse> saveEmployee(EmployeeDto employeeDto);

    ResponseEntity<StandardResponse> UpdateEmployee(EmployeeDto employee);

    ResponseEntity<StandardResponse> deleteEmployee(Integer id);
}
