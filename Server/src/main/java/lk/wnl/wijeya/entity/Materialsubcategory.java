package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Setter
@Getter
@Entity
public class Materialsubcategory {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "materialsubcategory")
    private Collection<Material> materials;
    @ManyToOne
    @JoinColumn(name = "materialcategory_id", referencedColumnName = "id", nullable = false)
    private Materialcategory materialcategory;


}
