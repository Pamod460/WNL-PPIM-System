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
public class Unittype {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "unittype")
    private Collection<Material> materialsById;

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

}
