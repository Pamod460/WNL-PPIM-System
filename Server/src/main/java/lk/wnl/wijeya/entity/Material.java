package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Setter
@Getter
@Entity
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
    @Column(name = "unitprice")
    private BigDecimal unitprice;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "dointroduced")
    private Date dointroduced;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id", nullable = false)
    private Unittype unittype;
    @ManyToOne
    @JoinColumn(name = "materialstatus_id", referencedColumnName = "id", nullable = false)
    private Materialstatus materialstatus;
    @ManyToOne
    @JoinColumn(name = "materialsubcategory_id", referencedColumnName = "id", nullable = false)
    private Materialsubcategory materialsubcategory;

    @OneToMany(mappedBy = "material")
    private Set<Supply> supplies = new LinkedHashSet<>();

    public Material(Integer id, String name) {
    }

    public Material() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Material material = (Material) o;
        return Objects.equals(id, material.id) && Objects.equals(code, material.code) && Objects.equals(name, material.name) && Objects.equals(quantity, material.quantity) && Objects.equals(rop, material.rop) && Objects.equals(unitprice, material.unitprice) && Objects.equals(description, material.description) && Objects.equals(dointroduced, material.dointroduced) && Arrays.equals(photo, material.photo);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, code, name, quantity, rop, unitprice, description, dointroduced);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }

}
