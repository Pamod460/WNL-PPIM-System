package lk.wnl.wijeya.dto;


import lk.wnl.wijeya.entity.VehicleModel;
import lk.wnl.wijeya.entity.VehicleStatus;
import lk.wnl.wijeya.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Integer id;
    @Pattern(regexp = "^[A-Z]{2,3}-\\d{4}$", message = "Invalid Number")
    private String number;
    private LocalDate doAttached;
    @Pattern(regexp = "^\\d{4}$", message = "Invalid YOM")
    private Integer yom;
    @Pattern(regexp = "^\\d{3,5}$", message = "Invalid Capacity")
    private Integer capacity;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Pattern(regexp = "^\\d{0,7}$", message = "Invalid Current Meter Reading")
    private Integer curruntMeterReading;
    private LocalDate lastRegDate;
    private VehicleStatus vehicleStatus;
    private VehicleType vehicleType;
    private VehicleModel vehicleModel;
    private String logger;

    public VehicleDto(Integer id, String number) {
        this.id = id;
        this.number = number;
    }
}
