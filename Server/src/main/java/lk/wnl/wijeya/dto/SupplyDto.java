package lk.wnl.wijeya.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SupplyDto {

    private Integer id;
    private SupplierDto supplier;
    private MaterialDto material;

}