package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.PaperPorderPaper;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class PaperPorderPaperDto {

    private Integer id;
    private Material material;
    private Integer quentity;
    private BigDecimal expectedLineCost;
}