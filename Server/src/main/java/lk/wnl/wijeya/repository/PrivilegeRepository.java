package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.Operation;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PrivilegeRepository extends JpaRepository<Privilege,Integer> {

    Optional<Privilege> findById(Integer id);

    @Query("select e from Privilege e where e.id = :id")
    Privilege findByMyId(@Param("id") Integer id);

    boolean existsByRoleAndModuleAndOperation(Role role, Module module, Operation operation);
}
