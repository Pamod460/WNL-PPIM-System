package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.entity.PaperGrn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupplierPaymentGrnDto {
    private Integer id;
    private PaperGrn paperGrn;
    private MaterialGrn materialGrn;

}