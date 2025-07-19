package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.PaperGrn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface PaperGRNRepository extends JpaRepository<PaperGrn,Integer> {
    boolean existsByCode(String code);

    PaperGrn findTopByCodeStartsWithOrderByCodeDesc(String codePrefix);
    @Query("SELECT SUM(mgm.quantity) FROM PaperGrnPaper mgm " +
            "JOIN mgm.paperGrn mg " +
            "WHERE mg.paperPorder.id = :porderId AND mgm.paper.id = :materialId")
    BigDecimal sumReceivedQtyByPorderAndPaper(@Param("porderId") Integer porderId, @Param("materialId") Integer materialId);

}
