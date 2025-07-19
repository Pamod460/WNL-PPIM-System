package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialPorderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialPorderStatusRepository extends JpaRepository<MaterialPorderStatus,Integer> {
    MaterialPorderStatus findByName(String name);
}
