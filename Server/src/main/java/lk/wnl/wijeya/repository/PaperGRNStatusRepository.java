package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.PaperGrnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperGRNStatusRepository extends JpaRepository<PaperGrnStatus,Integer> {
    PaperGrnStatus findByName(String name);
}
