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
@Table(name = "material_issue")

public class MaterialIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @JsonBackReference
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "production_order_id", nullable = false)
    private ProductionOrder productionOrder;

    @JsonManagedReference
    @OneToMany(mappedBy = "materialIssue",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<IssuedMaterial> issuedMaterials = new LinkedHashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Transient
    private String logger;

    @Column(name = "issued_time")
    private LocalTime issuedTime;

    public String getLogger() {
        return this.createdBy.getUsername();
    }

}