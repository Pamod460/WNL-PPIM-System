package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Agent;
import lk.wnl.wijeya.entity.AgentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentOrderRepository extends JpaRepository<AgentOrder,Integer> {
    boolean existsByOrderNumber(String number);



    boolean existsByOrderNumberAndIdNot(String number, Integer id);


    AgentOrder findTopByOrderByIdDesc();
}
