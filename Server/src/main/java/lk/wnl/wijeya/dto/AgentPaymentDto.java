package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.CheqPayment;
import lk.wnl.wijeya.entity.Distribution;
import lk.wnl.wijeya.entity.PaymentStatus;
import lk.wnl.wijeya.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Table;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "agent_payment")
public class AgentPaymentDto {
    private Integer id;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private DistributionDto distribution;
    private AgentPaymentTypeDto agentPaymentType;
    private PaymentStatusDto paymentStatus;
    private Set<CheqPaymentDto> cheqPayments;
    private String logger;

    public AgentPaymentDto(Integer id) {
        this.id = id;
    }
}