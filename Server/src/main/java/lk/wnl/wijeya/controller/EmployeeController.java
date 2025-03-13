package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.EmployeeDao;
import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;
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

        employees = employees.stream().map(
                employee -> {
                    Employee e = new Employee(employee.getId(), employee.getCallingname());
                    return e;
                }
        ).collect(Collectors.toList());

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
    public HashMap<String, String> add(@RequestBody Employee employee) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (employeedao.findByNumber(employee.getNumber()) != null)
            errors = errors + "<br> Existing Number";
        if (employeedao.findByNic(employee.getNic()) != null)
            errors = errors + "<br> Existing NIC";
        if (employeedao.existsByEmail(employee.getEmail()))
            errors = errors + "<br> Existing Email";
        if (employeedao.existsByMobile(employee.getMobile()))
            errors = errors + "<br> Existing Mobile Number";

        System.out.println(employee.getDoassignment());

        if (errors == "")
            employeedao.save(employee);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(employee.getId()));
        responce.put("url", "/employees/" + employee.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String, String> update(@RequestBody Employee employee) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Employee emp1 = employeedao.findByNumber(employee.getNumber());
        Employee emp2 = employeedao.findByNic(employee.getNic());
        Employee emp3 = employeedao.findByMobile(employee.getMobile());
        Employee emp4 = employeedao.findByEmail(employee.getEmail());

        if (emp1 != null && employee.getId() != emp1.getId())
            errors = errors + "<br> Existing Number";
        if (emp2 != null && employee.getId() != emp2.getId())
            errors = errors + "<br> Existing NIC";

        if (emp3 != null && employee.getId() != emp3.getId())
            errors = errors + "<br> Existing Mobile number";

        if (emp4 != null && employee.getId() != emp4.getId())
            errors = errors + "<br> Existing Email";

        System.out.println(employee.getPhoto().length);

        if (errors == "") employeedao.save(employee);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(employee.getId()));
        responce.put("url", "/employees/" + employee.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Employee employee = employeedao.findByMyId(id);

        if (employee == null){
            errors = errors + "<br> Employee Does Not Existed";
        }
        else{
            boolean userAccExists = userDao.existsByEmployee(employee);
            if (userAccExists){
                errors = "Cannot delete employee. A user account is associated with this employee";
            }
        }

        if (errors.isEmpty()) {
            employeedao.delete(employee);
        }

        responce.put("id", String.valueOf(id));
        responce.put("url", "/employees/" + id);
        responce.put("errors", errors);

        return responce;
    }

}




