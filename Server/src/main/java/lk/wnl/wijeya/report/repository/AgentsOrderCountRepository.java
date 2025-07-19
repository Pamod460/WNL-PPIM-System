package lk.wnl.wijeya.report.repository;

import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.report.entity.AgentsOrderCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgentsOrderCountRepository extends JpaRepository<AgentOrder,Integer> {
    @Query("SELECT NEW AgentsOrderCount(a.agent.fullName, COUNT(a)) FROM AgentOrder a WHERE (:startDate IS NULL OR a.orderDate >= :startDate) AND (:endDate IS NULL OR a.orderDate <= :endDate) GROUP BY a.agent.fullName ORDER BY COUNT(a) DESC")
    List<AgentsOrderCount> countAgentOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
