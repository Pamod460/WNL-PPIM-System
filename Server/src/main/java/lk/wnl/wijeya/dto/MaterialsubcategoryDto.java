package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Materialcategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialsubcategoryDto {
    private Integer id;
    private String name;
    private MaterialCategoryDto materialcategory;
}
