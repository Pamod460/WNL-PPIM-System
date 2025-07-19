package lk.wnl.wijeya.report.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
public class AgentsOrderCount {
    @Id
    private Long id;

    private String fullName;
    private Long orderCount;

    public AgentsOrderCount(String fullName, Long orderCount) {
        this.fullName = fullName;
        this.orderCount = orderCount;
    }


    public AgentsOrderCount() {

    }
}
