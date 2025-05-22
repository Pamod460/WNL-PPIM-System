package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Paper;
import lk.wnl.wijeya.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaperSupplyDto {
    private Integer id;
    private Paper paper;
    private Supplier supplier;

}