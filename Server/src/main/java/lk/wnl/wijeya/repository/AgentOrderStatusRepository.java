package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.AgentOrderStatus;
import lk.wnl.wijeya.entity.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentOrderStatusRepository extends JpaRepository<AgentOrderStatus,Integer> {
}
