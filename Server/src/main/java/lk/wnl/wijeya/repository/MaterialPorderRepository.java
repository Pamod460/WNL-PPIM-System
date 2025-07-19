package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialPorder;
import lk.wnl.wijeya.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialPorderRepository extends JpaRepository<MaterialPorder,Integer> {
    boolean existsByPoNumber(String code);

    MaterialPorder findTopByPoNumberStartsWithOrderByPoNumberDesc(String textPart);
}
