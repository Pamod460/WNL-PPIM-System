package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.PaperGrnPaper;
import lk.wnl.wijeya.entity.PaperPorder;
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
public class PaperGrnDto {

    private Integer id;
    private BigDecimal grandTotal;
    private LocalDate date;
    private LocalTime time;
    private String description;
    private PaperPorderDto paperPorder;
    private String logger;
    private PaperGrnStatusDto paperGrnStatus;
    private String code;
    private Set<PaperGrnPaperDto> paperGrnPapers;
    public PaperGrnDto(Integer id, String code) {
        this.id = id;
        this.code = code;
    }
}