package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.VehicleBrand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VehicleModelDto {

    private Integer id;
    private String name;
    private VehicleBrand vehicleBrand;
}
