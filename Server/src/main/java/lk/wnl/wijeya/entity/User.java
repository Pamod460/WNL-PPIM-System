package lk.wnl.wijeya.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.sql.Time;
import java.util.Collection;
import java.util.Objects;

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
    private Usestatus usestatus;
    @ManyToOne
    @JoinColumn(name = "usetype_id", referencedColumnName = "id", nullable = false)
    private Usetype usetype;

    @OneToMany(mappedBy = "user",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Userrole> userroles;
    @Basic
    @Column(name = "isactive")
    private boolean isactive;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!Objects.equals(id, user.id)) return false;
        if (!Objects.equals(username, user.username)) return false;
        if (!Objects.equals(password, user.password)) return false;
        if (!Objects.equals(docreated, user.docreated)) return false;
        if (!Objects.equals(tocreated, user.tocreated)) return false;
        if (!Objects.equals(description, user.description)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (docreated != null ? docreated.hashCode() : 0);
        result = 31 * result + (tocreated != null ? tocreated.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }

}
