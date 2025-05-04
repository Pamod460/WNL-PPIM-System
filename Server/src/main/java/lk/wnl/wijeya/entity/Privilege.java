package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
public class Privilege {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "authority")
    private String authority;
    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private Role role;
    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id", nullable = false)
    private Module module;
    @ManyToOne
    @JoinColumn(name = "operation_id", referencedColumnName = "id", nullable = false)
    private Operation operation;



}
