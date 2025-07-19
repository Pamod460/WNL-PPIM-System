package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.PaperIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperIssueRepository extends JpaRepository<PaperIssue,Integer> {
    PaperIssue findTopByOrderByIdDesc();

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Integer id);
}
