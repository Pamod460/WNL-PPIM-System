package lk.wnl.wijeya.dto;


import lk.wnl.wijeya.entity.VehicleModel;
import lk.wnl.wijeya.entity.VehicleStatus;
import lk.wnl.wijeya.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
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
    @Min(value = 1900, message = "Invalid YOM")
    @Max(value = 2100, message = "Invalid YOM")
    private Integer yom;
    @Min(value = 100, message = "Invalid Capacity")
    @Max(value = 99999, message = "Invalid Capacity")
    private Integer capacity;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Min(value = 0, message = "Invalid Current Meter Reading")
    @Max(value = 9999999, message = "Invalid Current Meter Reading")
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
