package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.util.regex.RegexPattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;
import java.sql.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {

    private Integer id;
    @Pattern(regexp = "^E\\d{3}$", message = "Invalid Number")
    private String number;
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    private String fullname;
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Calligname")
    private String callingname;
    private byte[] photo;
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dobirth;
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    private String nic;
    @Pattern(regexp = "^./*$", message = "Invalid Address")
    private String address;
    @Pattern(regexp = "^((\\+94|0)(70|71|72|74|75|76|77|78)\\d{7})$", message = "Invalid Mobile Number")
    private String mobile;
    @Pattern(regexp = "^(0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|51|52|54|55|57|61|63|65|66|67|71|81|91)-?[0-9]{7}?)$", message = "Invalid Landphone Number")
    private String land;
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email")
    private String email;
    private Date doassignment;
    @Pattern(regexp = "^(.*)?$", message = "Invalid Description")
    private String description;
    private Gender gender;
    private EmployeeType employeeType;
    private Designation designation;
    private EmployeeStatus employeeStatus;

    public EmployeeDto(Integer id, String callingname){
        this.id = id;
        this.callingname = callingname;
    }

}
