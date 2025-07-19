package lk.wnl.wijeya.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Dashboard {
    private Integer vehicleCount;
    private Integer supplierCount;
    private Integer productCount;
    private Integer agentCount;

}