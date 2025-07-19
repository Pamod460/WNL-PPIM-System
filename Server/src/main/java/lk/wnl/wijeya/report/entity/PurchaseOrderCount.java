package lk.wnl.wijeya.report.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Setter
@Getter
@Entity
public class PurchaseOrderCount {
    @Id
    private Long id;

    private String fullName;
    private Long orderCount;

    public PurchaseOrderCount(String fullName, Long orderCount) {
        this.fullName = fullName;
        this.orderCount = orderCount;
    }


    public PurchaseOrderCount() {

    }
}
