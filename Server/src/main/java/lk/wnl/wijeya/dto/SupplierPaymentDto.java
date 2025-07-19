package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.PaymentStatus;
import lk.wnl.wijeya.entity.Supplier;
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
public class SupplierPaymentDto {

    private Integer id;
    private Supplier supplier;
    private String referenceNo;
    private LocalDate date;
    private LocalTime time;
    private BigDecimal amount;
    private BigDecimal balance;
    private PaymentStatus paymentStatus;
    private PaymentTypeDto paymentType;
    private GrnTypeDto grnType;
    private Set<SupplierPaymentGrnDto> supplierPaymentGrns;
    private String logger;

    public SupplierPaymentDto(Integer id, String referenceNo) {
        this.id = id;
        this.referenceNo = referenceNo;
    }
}