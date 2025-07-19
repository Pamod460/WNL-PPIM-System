package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperRepository extends JpaRepository<Paper,Integer> {
    boolean existsByCode(String code);

    Paper findTopByCodeStartingWithOrderByCodeDesc(String textPart);
}
