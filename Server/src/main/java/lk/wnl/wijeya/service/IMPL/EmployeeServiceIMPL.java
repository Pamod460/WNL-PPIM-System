package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.EmployeeRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.EmployeeService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmployeeServiceIMPL implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<EmployeeDto> getAllEmployees(HashMap<String, String> params) {

        List<Employee> employees = this.employeeRepository.findAll();
        if (!employees.isEmpty()) {

            if (params.isEmpty()) return objectMapper.toEmployeeDtoList(employees);

            String number = params.get("number");
            String genderid = params.get("genderid");
            String fullname = params.get("fullname");
            String designationid = params.get("designationid");
            String nic = params.get("nic");

            Stream<Employee> estream = employees.stream();

            if (designationid != null)
                estream = estream.filter(e -> e.getDesignation().getId() == Integer.parseInt(designationid));
            if (genderid != null) estream = estream.filter(e -> e.getGender().getId() == Integer.parseInt(genderid));
            if (number != null) estream = estream.filter(e -> e.getNumber().equals(number));
            if (nic != null) estream = estream.filter(e -> e.getNic().contains(nic));
            if (fullname != null) estream = estream.filter(e -> e.getFullname().contains(fullname));

            return objectMapper.toEmployeeDtoList(estream.collect(Collectors.toList()));
        } else {
            throw new ResourceNotFoundException("Employees Not Found");
        }
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = this.employeeRepository.findAllNameIdDesignation();
        if (!employees.isEmpty()) {
            return objectMapper.toEmployeeDtoList(employees);

        } else {
            throw new ResourceNotFoundException("Employees Not Found");
        }
    }



    @Override
    public ResponseEntity<Map<String, String>> getLastEmployeeCode() {
        String code;
        Employee employee = employeeRepository.findTopByOrderByIdDesc();

        int no = (employee != null) ? Integer.parseInt(employee.getNumber().substring(1)) + 1 : 1;

        if (no < 10) {
            code = "E00" + no;
        } else if (no < 100) {
            code = "E0" + no;
        } else {
            code = "E" + no;
        }

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<StandardResponse> saveEmployee(EmployeeDto employeeDto) {
        Employee employee = objectMapper.toEmployeeEntity(employeeDto);
        if (employeeRepository.existsByNumber(employee.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (employeeRepository.existsByNic(employee.getNic())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }
        if (employeeRepository.existsByMobile(employee.getMobile())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }
        Employee emp = employeeRepository.save(employee);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Employee Added Successfully",
                        new EmployeeDto(emp.getId(), emp.getFullname())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateEmployee(EmployeeDto employeeDto) {

        Employee employee = objectMapper.toEmployeeEntity(employeeDto);

        employeeRepository.findById(employee.getId()).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (employeeRepository.existsByNumberAndIdNot(employee.getNumber(), employee.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (employeeRepository.existsByNicAndIdNot(employee.getNic(), employee.getId())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (employeeRepository.existsByMobileAndIdNot(employee.getMobile(), employee.getId())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }
        if (employeeRepository.existsByEmailAndIdNot(employee.getEmail(), employee.getId())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }

        Employee emp = employeeRepository.save(employee);
        return ResponseEntity.ok(new StandardResponse(200, "Employee Updated Successfully", new EmployeeDto(emp.getId(), emp.getFullname())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee Not Found"));
        if (userRepository.existsByEmployee(employee)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StandardResponse(400, "Cannot delete employee. A user account is associated with this employee", null));
        }
        employeeRepository.delete(employee);
        return new ResponseEntity<>(new StandardResponse(200, "Employee Deleted Successfully", null), HttpStatus.OK);
    }
}
