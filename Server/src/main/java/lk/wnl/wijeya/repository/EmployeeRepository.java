package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {


    Employee findTopByOrderByIdDesc();


    Optional<Employee> findById(Integer id);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    @Query("SELECT NEW Employee(e.id,e.fullname ,e.callingname,e.designation) FROM Employee e")
    List<Employee> findAllNameIdDesignation();


    boolean existsByNumberAndIdNot(String number, Integer id);

    boolean existsByNicAndIdNot(String nic, Integer id);

    boolean existsByMobileAndIdNot(String mobile, Integer id);

    boolean existsByEmailAndIdNot(String email, Integer id);

    boolean existsByNumber(String number);

    boolean existsByNic(String nic);


//    Employee findByNumber(String number);

//    Employee findByEmail(String email);
//    Employee findByMobile(String mobile);
//    Employee findByNic(String nic);
//    @Query("select e from Employee e where e.id = :id")
//    Employee findByMyId(@Param("id") Integer id);

}

