package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IssuedMaterialDto {

    private Integer id;

    private Material material;
    private Integer quantity;

}