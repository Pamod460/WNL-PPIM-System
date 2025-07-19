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
public class AgentOrderProductDto {
    private Integer id;
    private Integer quantity;
    private BigDecimal lineTotal;
    private ProductDto product;
    private ProductDesignDto productDesign;

}