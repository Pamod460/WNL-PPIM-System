package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.LinkedHashSet;
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
    private UnitType unittype;
    @ManyToOne
    @JoinColumn(name = "materialstatus_id", referencedColumnName = "id", nullable = false)
    private Materialstatus materialstatus;
    @ManyToOne
    @JoinColumn(name = "materialsubcategory_id", referencedColumnName = "id", nullable = false)
    private Materialsubcategory materialsubcategory;
    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Set<Supply> supplies = new LinkedHashSet<>();

    public Material(Integer id, String name) {
    }

    public Material() {

    }



}
