package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "production_order")
public class ProductionOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "order_no", length = 45)
    private String orderNo;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "created_time")
    private LocalTime createdTime;

    @Column(name = "expected_date")
    private LocalDate expectedDate;

    @Column(name = "expected_time")
    private Integer expectedTime;

    @Lob
    @Column(name = "description")
    private String description;

    @JsonBackReference
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_design_id", nullable = false)
    private ProductDesign productDesign;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "production_order_status_id", nullable = false)
    private ProductionOrderStatus productionOrderStatus;


    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;


//    @JsonBackReference
    @JsonManagedReference
    @OneToMany(mappedBy = "productionOrder")
    private Set<MaterialIssue> materialIssues = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "productionOrder")
    private Set<PaperIssue> paperIssues = new LinkedHashSet<>();

    @Transient
    private String logger;
    public String getLogger() {
        return createdBy != null ? createdBy.getUsername() : null;
    }


}