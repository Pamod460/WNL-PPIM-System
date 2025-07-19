package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "product_design")
public class ProductDesign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "design_document")
    private byte[] designDocument;

    @Column(name = "images")
    private byte[] images;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_design_status_id", nullable = false)
    private ProductDesignStatus productDesignStatus;

    @Column(name = "date")
    private LocalDateTime date;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Transient
    private String logger;

    @JsonBackReference
    @OneToMany(mappedBy = "productDesign")
    private Set<ProductionOrder> productionOrders = new LinkedHashSet<>();

    public String getLogger() {
        return this.createdBy.getUsername();
    }
}