package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "supplier_payment_grn")
public class SupplierPaymentGrn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplier_payment_id", nullable = false)
    private SupplierPayment supplierPayment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paper_grn_id")
    private PaperGrn paperGrn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_grn_id")
    private MaterialGrn materialGrn;

}