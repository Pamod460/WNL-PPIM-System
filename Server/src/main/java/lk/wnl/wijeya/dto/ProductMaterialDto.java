package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialDto {
    private Integer id;
    private Product product;
    private Integer quantity;
    private BigDecimal lineCost;
}