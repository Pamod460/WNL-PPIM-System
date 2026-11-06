package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialDto {

    private Integer id;
    private String code;
    private String name;
    private BigDecimal quantity;
    private BigDecimal rop;
    private BigDecimal unitPrice;
    private String description;
    private Date dointroduced;
    private byte[] photo;
    private UnitTypeDto unitType;
    private MaterialStatus materialStatus;
    private MaterialSubcategoryDto materialSubcategory;
    private String  logger;

    public MaterialDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public MaterialDto(Integer id, String name, BigDecimal quantity, BigDecimal rop, BigDecimal unitPrice) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.rop = rop;
        this.unitPrice = unitPrice;
    }

    public MaterialDto(Integer id, String name, BigDecimal unitPrice) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
    }


}
