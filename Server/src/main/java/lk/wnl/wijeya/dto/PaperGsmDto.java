package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Paper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaperGsmDto {

    private Integer id;

    private String name;

}