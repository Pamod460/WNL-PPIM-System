package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Material;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MaterialPorderMaterialDto {

    private Integer id;
    private Material material;
    private Integer quantity;
    private BigDecimal expectedLineCost;

}