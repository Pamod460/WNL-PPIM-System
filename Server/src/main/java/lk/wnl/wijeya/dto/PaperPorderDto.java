package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Supplier;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter

public class PaperPorderDto {

    private Integer id;
    private String poNumber;
    private LocalDate date;
    private BigDecimal expectedCost;
    private String description;
    private Supplier supplier;
    private Set<PaperPorderPaperDto> paperPorderPapers;
    private String logger;
    private String approvedManagerName;
    private String approvedAccountantName;
    private Boolean smApproved;
    private Boolean accountentApproved;



    public PaperPorderDto(Integer id, String poNumber) {
        this.id = id;
        this.poNumber = poNumber;
    }
}