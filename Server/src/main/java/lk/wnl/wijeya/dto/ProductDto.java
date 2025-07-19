package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.ProductMaterial;
import lk.wnl.wijeya.entity.ProductPaper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Integer id;
    private String code;
    private String name;
    private BigDecimal quantity;
    private LocalDate dointroduced;
    private BigDecimal unitPrice;
    private BigDecimal agentPrice;
    private String description;
    private byte[] photo;
    private ProductStatusDto productStatus;
    private ProductCategoryDto productCategory;
    private ProductFrequencyDto productfrequency;
    private Set<ProductMaterialDto> productMaterials;
    private Set<ProductPaperDto> productPapers;
    private String logger;
}