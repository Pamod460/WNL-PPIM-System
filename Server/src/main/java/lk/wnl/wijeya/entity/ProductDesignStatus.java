package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "product_design_status")
@ToString(onlyExplicitlyIncluded = true)
public class ProductDesignStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @OneToMany(mappedBy = "productDesignStatus")
    private Set<ProductDesign> productDesigns = new LinkedHashSet<>();

}