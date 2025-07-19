package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Distribution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistributionRepository extends JpaRepository<Distribution, Integer> {

    boolean existsByDistributionNumber(String distributionNumber);
    boolean existsByDistributionNumberAndIdNot(String distributionNumber, Integer id);

    Distribution findTopByOrderByIdDesc();
}
