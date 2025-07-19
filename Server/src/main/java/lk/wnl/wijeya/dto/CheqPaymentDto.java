package lk.wnl.wijeya.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@Setter

@Table(name = "cheq_payment")
public class CheqPaymentDto {
    private Integer id;
    private BankDto bank;
    private CheqStatusDto cheqStatus;
    private String cheqNumber;
    private LocalDate dorealized;
    private String description;
}