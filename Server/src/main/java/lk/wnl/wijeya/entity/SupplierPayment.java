package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "supplier_payment")
public class SupplierPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Size(max = 45)
    @Column(name = "reference_no", length = 45)
    private String referenceNo;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "time")
    private LocalTime time;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "balance", precision = 10, scale = 2)
    private BigDecimal balance;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "payment_status_id", nullable = false)
    private PaymentStatus paymentStatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "payment_type_id", nullable = false)
    private PaymentType paymentType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "grn_type_id", nullable = false)
    private GrnType grnType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER , optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "supplierPayment",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SupplierPaymentGrn> supplierPaymentGrns = new LinkedHashSet<>();

    @Transient
    private String logger;

    public String getLogger(){
        return  this.createdBy.getUsername();
    }

}