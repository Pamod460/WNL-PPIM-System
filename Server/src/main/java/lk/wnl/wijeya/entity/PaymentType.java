package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "payment_type")
public class PaymentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @OneToMany(mappedBy = "paymentType")
    private Set<SupplierPayment> supplierPayments = new LinkedHashSet<>();

}