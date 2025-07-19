package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.CheqStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheqStatusRepository extends JpaRepository<CheqStatus, Integer> {
    // Additional query methods can be defined here if needed
}
