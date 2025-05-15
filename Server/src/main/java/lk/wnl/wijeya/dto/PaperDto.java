package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

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
    private Integer quantity;
    private LocalDate dointroduesed;
    private String discription;
    private PaperGsm paperGsm;
    private PaperSize paperSize;
    private PaperType paperType;
    private PaperColor paperColor;
    private Set<PaperSupply> paperSupplies = new LinkedHashSet<>();
    private Set<ProductPaper> productPapers = new LinkedHashSet<>();
}