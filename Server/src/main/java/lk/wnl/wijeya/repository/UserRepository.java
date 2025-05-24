package lk.wnl.wijeya.repository;


import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository<User,Integer> {
    User findByUsername(String username);
    List<User> findAllByIsactive(boolean isactive);

    boolean existsByEmployee(Employee employee);

}
