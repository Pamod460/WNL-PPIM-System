package lk.wnl.wijeya.dashboard;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class DashboardRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Object[] getDashboardData() {
        String sql = "SELECT " +
                "  (SELECT COUNT(DISTINCT id) FROM vehicle), " +
                "  (SELECT COUNT(DISTINCT id) FROM supplier), " +
                "  (SELECT COUNT(DISTINCT id) FROM product), " +
                "  (SELECT COUNT(DISTINCT id) FROM agent)";

        return (Object[]) entityManager.createNativeQuery(sql).getSingleResult();
    }

    public Object[] getMaterialInventory() {
        String sql = "SELECT name AS productName, quantity, rop\n FROM material;";

        return (Object[]) entityManager.createNativeQuery(sql).getResultList().toArray();
    }

    public Object[] getPaperInventory() {
        String sql = "SELECT name AS productName, qoh, rop\n FROM paper;";

        return (Object[]) entityManager.createNativeQuery(sql).getResultList().toArray();
    }
}