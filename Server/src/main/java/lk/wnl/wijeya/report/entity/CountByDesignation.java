package lk.wnl.wijeya.report.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Setter
@Getter
@Entity
public class CountByDesignation {

    private Integer id;
    private String designation;
    private Long count;
    private double percentage;

    public CountByDesignation() {  }

    public CountByDesignation(String designation, Long count) {
        this.designation = designation;
        this.count = count;
    }

    @Id
    public Integer getId() {
        return id;
    }

}
