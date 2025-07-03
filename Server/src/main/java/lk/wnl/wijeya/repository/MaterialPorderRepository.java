package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialPorder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialPorderRepository extends JpaRepository<MaterialPorder,Integer> {
    boolean existsByPoNumber(String code);
}
