package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.RouteStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RouteDto {

    private Integer id;

    private String name;

    private byte[] map;

    private Integer distance;

    private Double estimatedTime;

    private String description;

    private LocalDate assignedDate;

    private RouteStatus routeStatus;
    private String routeNumber;
    private String logger;

    public RouteDto(Integer id, String routeNumber, String name) {
        this.id = id;
        this.routeNumber = routeNumber;
        this.name = name;
    }
}