package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "product_frequency")
public class ProductFrequency {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "frequency", length = 45)
    private String frequency;
    @JsonIgnore

    @OneToMany(mappedBy = "productfrequency")
    private Set<Product> products = new LinkedHashSet<>();

}