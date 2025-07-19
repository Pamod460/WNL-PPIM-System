package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Paper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IssuedPaperDto {
    private Integer id;
    private Integer quantity;
    private Paper paper;
}