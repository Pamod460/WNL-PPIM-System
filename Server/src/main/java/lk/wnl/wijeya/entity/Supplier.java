package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @Size(max = 10)
    @Column(name = "telephone", length = 10)
    private String telephone;

    @Size(max = 10)
    @Column(name = "fax_no", length = 10)
    private String faxNo;

    @Lob
    @Column(name = "address")
    private String address;

    @Size(max = 45)
    @Column(name = "email", length = 45)
    private String email;

    @Size(max = 45)
    @Column(name = "contact_person", length = 45)
    private String contactPerson;

    @Size(max = 10)
    @Column(name = "contact_person_telephone", length = 10)
    private String contactPersonTelephone;

    @Column(name = "regdate")
    private LocalDate regdate;

    @Size(max = 15)
    @Column(name = "bank_acc_no", length = 15)
    private String bankAccNo;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", nullable = false)
    private SupplierStatus supplierstatus;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "suppliertype_id", nullable = false)
    private SupplierType suppliertype;

    @OneToMany(mappedBy = "supplier",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Supply> supplies;

    @Size(max = 6)
    @Column(name = "reg_no", length = 6)
    private String regNo;

    @Size(max = 100)
    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Size(max = 100)
    @Column(name = "bank_branch", length = 100)
    private String bankBranch;

    @Size(max = 100)
    @Column(name = "accont_holder", length = 100)
    private String accontHolder;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false, referencedColumnName = "id")
    private Country country;

}