package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaperDto {

    private Integer id;
    private String name;
    private BigDecimal unitPrice;
    private String code;
    private LocalDate doIntroduced;
    private String description;
    private PaperGsmDto paperGsm;
    private PaperSizeDto paperSize;
    private PaperTypeDto paperType;
    private PaperColorDto paperColor;
    private PaperStatusDto paperStatus;
    private BigDecimal rop;
    private BigDecimal qoh;
    private PaperUnitTypeDto paperUnitType;
    private String logger;

    public PaperDto(Integer id, String name) {
        this.id = id;
        this.name = name;

    }

    public PaperDto(Integer id, String name, BigDecimal unitprice) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitprice;
    }


}