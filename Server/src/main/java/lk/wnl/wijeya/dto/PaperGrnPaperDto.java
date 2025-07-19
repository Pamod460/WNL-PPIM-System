package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaperGrnPaperDto {

    private Integer id;
    private BigDecimal lineCost;
    private BigDecimal unitCost;
    private Integer quantity;
    private PaperGrnDto paperGrnDto;

}