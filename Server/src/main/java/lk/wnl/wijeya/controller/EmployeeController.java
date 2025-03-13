package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.EmployeeDao;
import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {

    @Autowired
    private EmployeeDao employeedao;

    @Autowired
    private UserDao userDao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Employee> get(@RequestParam HashMap<String, String> params) {

        List<Employee> employees = this.employeedao.findAll();

        if (params.isEmpty()) return employees;

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

        return estream.collect(Collectors.toList());

    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Employee> get() {

        List<Employee> employees = this.employeedao.findAllNameId();

        employees = employees.stream().map(employee -> {
            Employee e = new Employee(employee.getId(), employee.getCallingname());
            return e;
        }).collect(Collectors.toList());

        return employees;

    }

    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastEmployee() {
        String code;
        Employee employee = employeedao.findTopByOrderByIdDesc();

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public ResponseEntity<StandardResponse> add(@RequestBody Employee employee) {
        if (employeedao.existsByNumber(employee.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (employeedao.existsByNic(employee.getNic())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (employeedao.existsByEmail(employee.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }
        if (employeedao.existsByMobile(employee.getMobile())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }
        System.out.println(employee.getLand());
        Employee emp = employeedao.save(employee);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Employee Added Successfully",
                        new Employee(emp.getId(), emp.getFullname())));
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody Employee employee) {
        employeedao.findById(employee.getId()).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (employeedao.existsByNumberAndIdNot(employee.getNumber(), employee.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (employeedao.existsByNicAndIdNot(employee.getNic(), employee.getId())) {
            throw new ResourceAlreadyExistException("NIC Already Exists");
        }
        if (employeedao.existsByMobileAndIdNot(employee.getMobile(), employee.getId())) {
            throw new ResourceAlreadyExistException("Mobile Number Already Exists");
        }
        if (employeedao.existsByEmailAndIdNot(employee.getEmail(), employee.getId())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }

        Employee emp = employeedao.save(employee);
        return ResponseEntity.ok(new StandardResponse(200, "Employee Updated Successfully", new Employee(emp.getId(), emp.getFullname())));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        Employee employee = employeedao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee Not Found"));
        if (userDao.existsByEmployee(employee)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StandardResponse(400, "Cannot delete employee. A user account is associated with this employee", null));
        }
//        employeedao.delete(employee);
        return new ResponseEntity<>(new StandardResponse(200, "Employee Deleted Successfully", null), HttpStatus.OK);
    }

}