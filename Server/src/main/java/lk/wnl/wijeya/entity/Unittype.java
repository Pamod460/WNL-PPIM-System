package lk.wnl.wijeya.entity;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Unittype {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @OneToMany(mappedBy = "unittype")
    private Collection<Material> materialsById;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Unittype unittype = (Unittype) o;
        return Objects.equals(id, unittype.id) && Objects.equals(name, unittype.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    public Collection<Material> getMaterialsById() {
        return materialsById;
    }

    public void setMaterialsById(Collection<Material> materialsById) {
        this.materialsById = materialsById;
    }
}
