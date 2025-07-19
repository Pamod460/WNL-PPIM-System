package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialIssueRepository extends JpaRepository<MaterialIssue,Integer> {
    MaterialIssue findTopByOrderByIdDesc();

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Integer id);
}
