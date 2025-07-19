package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.MaterialPorder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialGrnDto {
    private Integer id;
    private BigDecimal grandTotal;
    private LocalDate date;
    private LocalTime time;
    private String description;
    private MaterialGrnStatusDto materialGrnStatus;
    private MaterialPorderDto materialPorder;
    private Set<MaterialGrnMaterialDto> materialGrnMaterials;
    private String code;
    private String logger;

    public MaterialGrnDto(Integer id, String code) {
        this.id = id;
        this.code = code;
    }
}