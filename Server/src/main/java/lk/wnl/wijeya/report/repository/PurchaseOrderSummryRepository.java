package lk.wnl.wijeya.report.repository;

import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.report.entity.PurchaseOrderCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface PurchaseOrderSummryRepository extends JpaRepository<AgentOrder,Integer> {
    @Query("SELECT mpo.supplier.name AS supplier, COUNT(mpo) AS orderCount, SUM(mpo.expectedCost) AS totalExpectedCost " +
            "FROM MaterialPorder mpo " +
            "WHERE (:startDate IS NULL OR mpo.date >= :startDate) AND (:endDate IS NULL OR mpo.date <= :endDate) " +
            "GROUP BY mpo.supplier.id")
    List<Map<String, Object>> summarizeMaterialPurchaseOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ppo.supplier.name AS supplier, COUNT(ppo) AS orderCount, SUM(ppo.expectedCost) AS totalExpectedCost " +
            "FROM PaperPorder ppo " +
            "WHERE (:startDate IS NULL OR ppo.date >= :startDate) AND (:endDate IS NULL OR ppo.date <= :endDate) " +
            "GROUP BY ppo.supplier.id")
    List<Map<String, Object>> summarizePaperPurchaseOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


}
