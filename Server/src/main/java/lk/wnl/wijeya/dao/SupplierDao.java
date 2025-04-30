package lk.wnl.wijeya.dao;


import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.validation.constraints.Size;


public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    boolean existsByName(String name);


    boolean existsByAccontHolderAndBankAccNoAndIdNot(@Size(max = 100) String accontHolder, @Size(max = 15) String bankAccNo, Integer id);

    Supplier findTopByOrderByIdDesc();
}
