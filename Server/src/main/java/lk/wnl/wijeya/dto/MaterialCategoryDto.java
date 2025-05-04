package lk.wnl.wijeya.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.wnl.wijeya.entity.Materialsubcategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialCategoryDto {
    private Integer id;
    private String name;
}
