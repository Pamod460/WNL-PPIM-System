package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment, Integer> {

    boolean existsByReferenceNo(String referenceNo);
    boolean existsByReferenceNoAndIdNot(String referenceNo, Integer id);

    SupplierPayment findTopByOrderByIdDesc();

    boolean existsBySupplierPaymentGrns_MaterialGrn(MaterialGrn materialGrn);
}
