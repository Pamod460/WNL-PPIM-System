package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialGrnMaterialDto {

    private Integer id;
    private BigDecimal lineCost;
    private BigDecimal unitPrice;
    private Integer quantity;
    private MaterialDto material;

}