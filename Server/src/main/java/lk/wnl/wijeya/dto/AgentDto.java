package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentDto {
    Integer id;
    String number;
    String nic;
    String fullName;
    String mobile;
    String land;
    String address;
    String email;
    LocalDate doRegisterd;
    String description;
    BigDecimal longitude;
    BigDecimal latitude;
    DistrictDto district;
    RouteDto route;
    AgentStatusDto agentStatus;
    String logger;

    public AgentDto(Integer id, String number, String nic, String fullName) {
        this.id = id;
        this.number = number;
        this.nic = nic;
        this.fullName = fullName;
    }
}