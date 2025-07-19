package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.MaterialSubcategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SupplyDto {

    private Integer id;
    //    private SupplierDto supplier;
    private MaterialSubcategory materialSubcategory;


}