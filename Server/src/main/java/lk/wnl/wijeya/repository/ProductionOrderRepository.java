package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.ProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionOrderRepository extends JpaRepository<ProductionOrder,Integer> {
    
    boolean existsByOrderNo(String orderNo);
    boolean existsByOrderNoAndIdNot(String orderNo, Integer id);

    ProductionOrder findTopByOrderByIdDesc();
}
