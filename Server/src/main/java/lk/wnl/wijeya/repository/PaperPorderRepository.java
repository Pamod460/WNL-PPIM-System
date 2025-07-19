package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.PaperPorder;
import lk.wnl.wijeya.entity.PaperPorderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperPorderRepository extends JpaRepository<PaperPorder,Integer> {
    boolean existsByPoNumber(String code);

    PaperPorder findTopByPoNumberStartsWithOrderByPoNumberDesc(String textPart);

//    PaperPorderStatus findByName(String name);
}
