package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductionOrderDto {
    private Integer id;
    private String orderNo;
    private Integer quantity;
    private LocalDate createdDate;
    private LocalTime createdTime;
    private LocalDate expectedDate;
    private Integer expectedTime;
    private String description;
    private ProductDesignDto productDesign;
    private ProductionOrderStatusDto productionOrderStatus;
    private String logger;

    public ProductionOrderDto(Integer id, String orderNo) {
        this.id = id;
        this.orderNo = orderNo;
    }
}