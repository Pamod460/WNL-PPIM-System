package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.ProductionOrder;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MaterialIssueDto {
    private Integer id;
    private String code;
    private LocalDate date;
    private LocalDate issuedDate;
    private LocalTime issuedTime;
    private Set<IssuedMaterialDto> issuedMaterials;
    private ProductionOrderDto productionOrder;
    private String logger;

    public MaterialIssueDto(Integer id, String code) {
        this.id = id;
        this.code = code;
    }
}