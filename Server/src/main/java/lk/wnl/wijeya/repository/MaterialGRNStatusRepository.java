package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialGrnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialGRNStatusRepository extends JpaRepository<MaterialGrnStatus,Integer> {
    MaterialGrnStatus findByName(String name);
}
