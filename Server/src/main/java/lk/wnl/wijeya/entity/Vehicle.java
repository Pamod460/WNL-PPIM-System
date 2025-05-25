package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Transient
    String logger;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Size(max = 10)
    @Column(name = "number", length = 10)
    private String number;
    @Column(name = "do_attachad")
    private LocalDate doAttached;
    @Column(name = "yom")
    private Integer yom;
    @Column(name = "capacity")
    private Integer capacity;
    @Lob
    @Column(name = "description")
    private String description;
    @Column(name = "currunt_meter_reading")
    private Integer curruntMeterReading;
    @Column(name = "last_reg_date")
    private LocalDate lastRegDate;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicle_model_id", nullable = false)
    private VehicleModel vehicleModel;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleType vehicleType;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicle_status_id", nullable = false)
    private VehicleStatus vehicleStatus;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    public String getLogger() {
        return createdBy.getUsername();
    }
}