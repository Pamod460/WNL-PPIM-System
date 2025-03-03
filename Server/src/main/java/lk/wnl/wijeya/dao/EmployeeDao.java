package lk.wnl.wijeya.dao;

import lk.wnl.wijeya.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeDao extends JpaRepository<Employee,Integer> {

    Employee findByNumber(String number);

    Employee findTopByOrderByIdDesc();
    Employee findByNic(String nic);
    Optional<Employee> findById(Integer id);

    Employee findByEmail(String email);
    Employee findByMobile(String mobile);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    @Query("select e from Employee e where e.id = :id")
    Employee findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Employee (e.id, e.callingname) FROM Employee e")
    List<Employee> findAllNameId();

}

