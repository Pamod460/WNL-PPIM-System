package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {
}
