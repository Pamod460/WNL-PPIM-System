package lk.wnl.wijeya.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaperDto {
    private Integer id;
    private String name;
    private BigDecimal unitprice;
}