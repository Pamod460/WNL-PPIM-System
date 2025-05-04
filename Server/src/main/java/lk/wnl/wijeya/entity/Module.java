package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Collection;

@Setter
@Getter
@Entity
public class Module {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;


    @JsonIgnore
    @OneToMany(mappedBy = "module")
    private Collection<Privilege> privileges;


}
