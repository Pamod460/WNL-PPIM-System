package lk.wnl.wijeya.entity;

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
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 6)
    @Column(name = "code", length = 6)
    private String code;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;


    @Column(name = "dointroduced")
    private LocalDate dointroduced;

    @Column(name = "unitprice", precision = 7, scale = 2)
    private BigDecimal unitprice;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "photo")
    private byte[] photo;
    @Column(name = "quantity", precision = 7)
    private BigDecimal quantity;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_status_id", nullable = false)
    private ProductStatus productStatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory productCategory;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "productfrequency_id", nullable = false)
    private ProductFrequency productfrequency;

    @OneToMany(mappedBy = "product",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductMaterial> productMaterials = new LinkedHashSet<>();


    @OneToMany(mappedBy = "product",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductPaper> productPapers = new LinkedHashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Transient
    private String logger;
    public String getLogger() {
        return this.createdBy.getUsername();
    }
}