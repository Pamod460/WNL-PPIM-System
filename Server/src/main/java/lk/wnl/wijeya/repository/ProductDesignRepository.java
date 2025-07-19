package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.ProductDesign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDesignRepository extends JpaRepository<ProductDesign,Integer> {

    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Integer id);
}
