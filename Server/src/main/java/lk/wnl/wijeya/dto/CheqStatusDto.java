package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cheq_status")
public class CheqStatusDto {
    private Integer id;
    private String name;

}