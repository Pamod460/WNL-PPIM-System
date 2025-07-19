package lk.wnl.wijeya.report.repository;

import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.report.entity.AgentsOrderCount;
import lk.wnl.wijeya.report.entity.PurchaseOrderCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderCountRepository extends JpaRepository<AgentOrder,Integer> {
    @Query("SELECT NEW PurchaseOrderCount(mpo.supplier.name, COUNT(mpo)) FROM MaterialPorder mpo WHERE (:startDate IS NULL OR mpo.date >= :startDate) AND (:endDate IS NULL OR mpo.date <= :endDate) GROUP BY mpo.supplier.id ORDER BY COUNT(mpo) DESC")
    List<PurchaseOrderCount> countMaterialPurchaseOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT NEW PurchaseOrderCount(ppo.supplier.name, COUNT(ppo)) FROM PaperPorder ppo WHERE (:startDate IS NULL OR ppo.date >= :startDate) AND (:endDate IS NULL OR ppo.date <= :endDate) GROUP BY ppo.supplier.id ORDER BY COUNT(ppo) DESC")
    List<PurchaseOrderCount> countPaperPurchaseOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


}
