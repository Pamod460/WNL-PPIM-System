package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.MaterialPorderMaterial;
import lk.wnl.wijeya.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialPorderDto {

    private Integer id;
    private String poNumber;
    private LocalDate date;
    private BigDecimal expectedCost;
    private String description;
    private MaterialPorderStatusDto materialPorderStatus;
    private Set<MaterialPorderMaterialDto> materialPorderMaterials;
    private SupplierDto supplier;
    private String logger;
    private String approvedManagerName;
    private String approvedAccountantName;
    private Boolean smApproved;
    private Boolean accountentApproved;



    public MaterialPorderDto(Integer id, String poNumber) {
        this.id = id;
        this.poNumber = poNumber;
    }
}