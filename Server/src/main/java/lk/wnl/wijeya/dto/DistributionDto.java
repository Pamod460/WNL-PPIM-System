package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.entity.DistributionProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DistributionDto {
    private Integer id;
    private String distributionNumber;
    private DistributionStatusDto distributionStatus;
    private AgentOrderDto agentOrder;
    private LocalDate date;
    private LocalTime time;
    private String logger;
    private BigDecimal grandTotal;
    private String description;
    private Set<DistributionProductDto> distributionProducts;


    public DistributionDto(Integer id, String distributionNumber) {
        this.id = id;
        this.distributionNumber = distributionNumber;
    }
}