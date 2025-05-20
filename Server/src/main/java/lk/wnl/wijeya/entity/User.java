package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.sql.Time;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Data
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "username")
    @Pattern(regexp = "^([a-zA-Z0-9_.-]+)$", message = "Invalid Username")
    private String username;
    @Basic
    @Column(name = "password")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    private String password;
    @Basic
    @Column(name = "docreated")
    private Date docreated;
    @Basic
    @Column(name = "tocreated")
    private Time tocreated;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "usestatus_id", referencedColumnName = "id", nullable = false)
    private UserStatus userStatus;
    @ManyToOne
    @JoinColumn(name = "usetype_id", referencedColumnName = "id", nullable = false)
    private UserType userType;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<UserRole> userRoles;
    @Basic
    @Column(name = "isactive")
    private boolean isactive;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private Set<Material> materials = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private Set<Paper> papers = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private Set<Product> products = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private Set<Supplier> suppliers = new LinkedHashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private Set<User> users = new LinkedHashSet<>();
    @Transient
    private String logger;
    public String getLogger() {
        return this.createdBy.getUsername();
    }

}
