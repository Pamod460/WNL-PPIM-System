package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialSubcategoryDto {
    private Integer id;
    private String name;
    private MaterialCategoryDto materialCategory;
}
