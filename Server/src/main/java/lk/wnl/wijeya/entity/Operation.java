package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Setter
@Getter
@Entity
public class Operation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;

    public Operation(){}



}
