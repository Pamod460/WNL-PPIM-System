package lk.wnl.wijeya.repository;


import lk.wnl.wijeya.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product,Integer> {

    boolean existsByCode(String code);

    Product findTopByOrderByIdDesc();

    boolean existsByCodeAndIdNot(String code, Integer id);
}
