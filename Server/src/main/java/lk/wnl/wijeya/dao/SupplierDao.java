package lk.wnl.wijeya.dao;


import lk.wnl.wijeya.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    boolean existsByName(String name);
}
