package lk.wnl.wijeya.repository;


import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material,Integer> {

    boolean existsByCode(String code);

    Material findTopByOrderByIdDesc();

    Material findTopByCodeStartingWithOrderByCodeDesc(String textPart);
}

