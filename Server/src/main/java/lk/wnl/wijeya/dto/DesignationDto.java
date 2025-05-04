package lk.wnl.wijeya.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.wnl.wijeya.entity.Employee;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DesignationDto {
    private Integer id;
    private String name;
}
