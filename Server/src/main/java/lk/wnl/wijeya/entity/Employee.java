package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")

    private String number;
    @Basic
    @Column(name = "fullname")

    private String fullname;
    @Basic
    @Column(name = "callingname")

    private String callingname;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @Basic
    @Column(name = "dobirth")

    private Date dobirth;
    @Basic
    @Column(name = "nic")

    private String nic;
    @Basic
    @Column(name = "address")

    private String address;
    @Basic
    @Column(name = "mobile")

    private String mobile;
    @Basic
    @Column(name = "land")
    private String land;
    @Basic
    @Column(name = "email")

    private String email;
    @Basic
    @Column(name = "doassignment")
    private Date doassignment;
    @Basic
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "emptype_id", referencedColumnName = "id", nullable = false)
    private EmployeeType employeeType;
    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id", nullable = false)
    private Designation designation;
    @ManyToOne
    @JoinColumn(name = "empstatus_id", referencedColumnName = "id", nullable = false)
    private EmployeeStatus employeeStatus;
    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<User> users;

    public Employee(Integer id, String callingname) {
        this.id = id;
        this.callingname = callingname;
    }

}
