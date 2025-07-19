package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Agent;
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
public class AgentOrderDto {
    private Integer id;
    private Agent agent;
    private String orderNumber;
    private String description;
    private LocalDate orderDate;
    private LocalTime orderTime;
    private BigDecimal grandTotal;
    private String logger;
    private AgentOrderStatusDto agentOrderStatus;

    private Set<AgentOrderProductDto> agentOrderProducts;

    public AgentOrderDto(Integer id, String orderNumber) {
        this.id = id;
        this.orderNumber = orderNumber;
    }
}