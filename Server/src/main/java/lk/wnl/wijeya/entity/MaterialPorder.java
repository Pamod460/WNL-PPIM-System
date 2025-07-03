package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "material_porder")
public class MaterialPorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 6)
    @Column(name = "po_number", length = 6)
    private String poNumber;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "expected_cost", precision = 10, scale = 2)
    private BigDecimal expectedCost;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "material_porder_status_id", nullable = false)
    private MaterialPorderStatus materialPorderStatus;

    @OneToMany(mappedBy = "materialPorder", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MaterialPorderMaterial> materialPorderMaterials = new LinkedHashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;


    @Transient
    private String logger;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_store_manager_id")
    private User approvedStoreManager;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_accountent_id")
    private User approvedAccountent;

    @JsonIgnore
    @OneToMany(mappedBy = "materialPorder")
    private Set<MaterialGrn> materialGrns = new LinkedHashSet<>();

    @Column(name = "sm_approved")
    private Boolean smApproved;

    @Column(name = "accountent_approved")
    private Boolean accountentApproved;
    @Transient
    private String approvedManagerName;
    @Transient
    private String approvedAccountantName;

    public String getLogger() {
        return this.createdBy.getUsername();
    }

    public String getApprovedManagerName() {
        return this.approvedStoreManager != null ? this.approvedStoreManager.getUsername() : null;
    }

    public String getApprovedAccountantName() {
        return this.approvedAccountent != null ? this.approvedAccountent.getUsername() : null;
    }
}