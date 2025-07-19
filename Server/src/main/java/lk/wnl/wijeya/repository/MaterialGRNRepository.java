package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialGrn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface MaterialGRNRepository extends JpaRepository<MaterialGrn,Integer> {
    boolean existsByCode(String code);

    MaterialGrn findTopByCodeStartsWithOrderByCodeDesc(String textPart);

    @Query("SELECT SUM(mgm.quantity) FROM MaterialGrnMaterial mgm " +
            "JOIN mgm.materialGrn mg " +
            "WHERE mg.materialPorder.id = :porderId AND mgm.material.id = :materialId")
    BigDecimal sumReceivedQtyByPorderAndMaterial(@Param("porderId") Integer porderId,
                                                 @Param("materialId") Integer materialId);
}
