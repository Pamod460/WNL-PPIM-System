package lk.wnl.wijeya.report.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Setter
@Getter
@Entity
public class AgentsCountByDistrict {

    private Integer id;
    private String district;
    private Long count;
    private double percentage;

    public AgentsCountByDistrict() {  }

    public AgentsCountByDistrict(String district, Long count) {
        this.district = district;
        this.count = count;
    }

    @Id
    public Integer getId() {
        return id;
    }

}
