package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserroleRepository extends JpaRepository<UserRole, Integer> {

    UserRole findById(int id);

}
