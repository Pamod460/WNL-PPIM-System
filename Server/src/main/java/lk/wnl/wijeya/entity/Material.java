package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.LinkedHashSet;
import java.util.Set;


@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Material {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "quantity")
    private BigDecimal quantity;
    @Basic
    @Column(name = "rop")
    private BigDecimal rop;

    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "dointroduced")
    private Date dointroduced;
    @Basic
    @Column(name = "photo")
    private byte[] photo;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Set<ProductMaterial> productMaterials = new LinkedHashSet<>();

//    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;


    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "material_status_id", nullable = false)
    private MaterialStatus materialStatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "unit_type_id", nullable = false)
    private UnitType unitType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "material_subcategory_id", nullable = false)
    private MaterialSubcategory materialSubcategory;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Set<MaterialPorderMaterial> materialPorderMaterials = new LinkedHashSet<>();

    @Column(name = "unit_price", precision = 7, scale = 2)
    private BigDecimal unitPrice;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Set<IssuedMaterial> issuedMaterials = new LinkedHashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Set<MaterialGrnMaterial> materialGrnMaterials = new LinkedHashSet<>();
    @Transient
    private String logger;

    public Material(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getLogger() {
        return this.createdBy.getUsername();
    }


}
