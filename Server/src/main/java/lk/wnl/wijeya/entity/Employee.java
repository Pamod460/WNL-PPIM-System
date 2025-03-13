package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.wnl.wijeya.util.RegexPattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

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
    @Pattern(regexp = "^E\\d{3}$", message = "Invalid Number")
    private String number;
    @Basic
    @Column(name = "fullname")
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    private String fullname;
    @Basic
    @Column(name = "callingname")
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Calligname")
    private String callingname;

    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @Basic
    @Column(name = "dobirth")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dobirth;
    @Basic
    @Column(name = "nic")
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    private String nic;
    @Basic
    @Column(name = "address")
    @Pattern(regexp = "^./*$", message = "Invalid Address")
    private String address;
    @Basic
    @Column(name = "mobile")
    @Pattern(regexp = "^((\\+94|0)(70|71|72|74|75|76|77|78)\\d{7})$", message = "Invalid Mobile Number")
    private String mobile;
    @Basic
    @Column(name = "land")
    @Pattern(regexp = "^(0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|51|52|54|55|57|61|63|65|66|67|71|81|91)-?[0-9]{7}?)$", message = "Invalid Landphone Number")
    private String land;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email")
    private String email;
    @Basic
    @Column(name = "doassignment")
    private Date doassignment;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^(.*)?$", message = "Invalid Description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "emptype_id", referencedColumnName = "id", nullable = false)
    private Emptype emptype;
    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id", nullable = false)
    private Designation designation;
    @ManyToOne
    @JoinColumn(name = "empstatus_id", referencedColumnName = "id", nullable = false)
    private Empstatus empstatus;
    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<User> users;

    public Employee(Integer id, String callingname){
        this.id = id;
        this.callingname = callingname;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        if (!Objects.equals(id, employee.id)) return false;
        if (!Objects.equals(number, employee.number)) return false;
        if (!Objects.equals(fullname, employee.fullname)) return false;
        if (!Objects.equals(callingname, employee.callingname)) return false;
        if (!Arrays.equals(photo, employee.photo)) return false;
        if (!Objects.equals(dobirth, employee.dobirth)) return false;
        if (!Objects.equals(nic, employee.nic)) return false;
        if (!Objects.equals(address, employee.address)) return false;
        if (!Objects.equals(mobile, employee.mobile)) return false;
        if (!Objects.equals(land, employee.land)) return false;
        if (!Objects.equals(email, employee.email)) return false;
        if (!Objects.equals(doassignment, employee.doassignment)) return false;
        if (!Objects.equals(description, employee.description)) return false;
        return true;
    }
    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (fullname != null ? fullname.hashCode() : 0);
        result = 31 * result + (callingname != null ? callingname.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(photo);
        result = 31 * result + (dobirth != null ? dobirth.hashCode() : 0);
        result = 31 * result + (nic != null ? nic.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (mobile != null ? mobile.hashCode() : 0);
        result = 31 * result + (land != null ? land.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (doassignment != null ? doassignment.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }
}
