package lk.wnl.wijeya.report.repository;

import lk.wnl.wijeya.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface InventoryReportRepository extends JpaRepository<Material, Integer> {

    @Query("SELECT m.code AS materialCode, m.name AS materialName, ut.name AS unitType, " +
            "SUM(m.quantity) AS totalQuantity, m.unitPrice AS unitPrice, ms.name AS status " +
            "FROM Material m " +
            "JOIN UnitType ut ON m.unitType.id = ut.id " +
            "JOIN MaterialStatus ms ON m.materialStatus.id = ms.id " +
            "WHERE (:code IS NULL OR m.code LIKE %:code%) " +
            "AND (:name IS NULL OR m.name LIKE %:name%) " +
            "AND (:status IS NULL OR ms.name LIKE %:status%) " +
            "GROUP BY m.code, m.name, ut.name, m.unitPrice, ms.name")
    List<Map<String, Object>> summarizeMaterialInventory(@Param("code") String code, @Param("name") String name, @Param("status") String status);

    @Query("SELECT p.code AS paperCode, p.name AS paperName, pt.name AS paperType, pu.name AS paperUnit, " +
            "p.paperGsm.id AS gsm, ps.name AS status, p.unitPrice AS unitPrice, " +
            "SUM(p.qoh) AS totalQuantity " +
            "FROM Paper p " +
            "JOIN PaperStatus ps ON p.paperStatus.id = ps.id " +
            "JOIN PaperType pt ON p.paperType.id = pt.id " +
            "JOIN PaperUnitType pu ON p.paperUnitType.id = pu.id " +
            "WHERE (:code IS NULL OR p.code LIKE %:code%) " +
            "AND (:name IS NULL OR p.name LIKE %:name%) " +
            "AND (:status IS NULL OR ps.name LIKE %:status%) " +
            "GROUP BY p.code, p.name, pt.name, pu.name, p.paperGsm.id, ps.name, p.unitPrice")
    List<Map<String, Object>> summarizePaperInventory(@Param("code") String code, @Param("name") String name, @Param("status") String status);
}