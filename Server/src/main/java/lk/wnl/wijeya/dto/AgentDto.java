package lk.wnl.wijeya.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentDto {
    Integer id;
    @Pattern(regexp = "^AG\\d{3}$", message = "Invalid Number")
    String number;
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    String nic;
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Full Name")
    String fullName;
    @Pattern(regexp = "^((\\+94|0)(70|71|72|74|75|76|77|78)\\d{7})$", message = "Invalid Mobile Number")
    String mobile;
    @Pattern(regexp = "^(0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|51|52|54|55|57|61|63|65|66|67|71|81|91)-?[0-9]{7}?)$", message = "Invalid Landphone Number")
    String land;
    String address;
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email")
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