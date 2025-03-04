package lk.wnl.wijeya.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.Objects;

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
    @Column(name = "quentity")
    private BigDecimal quentity;
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
    @JoinColumn(name = "materialcategory_id", referencedColumnName = "id", nullable = false)
    private Materialcategory materialcategory;
    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id", nullable = false)
    private Unittype unittype;
    @ManyToOne
    @JoinColumn(name = "materialstatus_id", referencedColumnName = "id", nullable = false)
    private Materialstatus materialstatus;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getQuentity() {
        return quentity;
    }

    public void setQuentity(BigDecimal quentity) {
        this.quentity = quentity;
    }

    public BigDecimal getRop() {
        return rop;
    }

    public void setRop(BigDecimal rop) {
        this.rop = rop;
    }

    public BigDecimal getUnitprice() {
        return unitprice;
    }

    public void setUnitprice(BigDecimal unitprice) {
        this.unitprice = unitprice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Material material = (Material) o;
        return Objects.equals(id, material.id) && Objects.equals(code, material.code) && Objects.equals(name, material.name) && Objects.equals(quentity, material.quentity) && Objects.equals(rop, material.rop) && Objects.equals(unitprice, material.unitprice) && Objects.equals(description, material.description) && Objects.equals(dointroduced, material.dointroduced) && Arrays.equals(photo, material.photo);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, code, name, quentity, rop, unitprice, description, dointroduced);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }

    public Materialcategory getMaterialcategory() {
        return materialcategory;
    }

    public void setMaterialcategory(Materialcategory materialcategory) {
        this.materialcategory = materialcategory;
    }

    public Unittype getUnittype() {
        return unittype;
    }

    public void setUnittype(Unittype unittype) {
        this.unittype = unittype;
    }

    public Materialstatus getMaterialstatus() {
        return materialstatus;
    }

    public void setMaterialstatus(Materialstatus materialstatus) {
        this.materialstatus = materialstatus;
    }
}
