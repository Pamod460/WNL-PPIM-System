package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "material_subcategory")
public class MaterialSubcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "material_category_id", nullable = false)
    private MaterialCategory materialCategory;

    @JsonIgnore
    @OneToMany(mappedBy = "materialSubcategory")
    private Set<Material> materials = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "materialSubcategory")
    private Set<Supply> supplies = new LinkedHashSet<>();

}