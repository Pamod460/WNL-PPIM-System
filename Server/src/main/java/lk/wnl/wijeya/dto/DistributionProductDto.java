package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Product;
import lk.wnl.wijeya.entity.ProductDesign;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DistributionProductDto {
    private Integer id;
    private ProductDto product;
    private Integer quantity;
    private BigDecimal lineTotal;
    private ProductDesignDto productDesign;

}