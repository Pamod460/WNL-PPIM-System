package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.UserRole;
import lk.wnl.wijeya.entity.UserStatus;
import lk.wnl.wijeya.entity.UserType;
import lombok.*;

import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.sql.Time;
import java.util.Collection;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
    private Integer id;
    @Pattern(regexp = "^([a-zA-Z0-9_.-]+)$", message = "Invalid Username")
    private String username;
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    private String password;
    private Date docreated;
    private Time tocreated;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    private Employee employee;
    private UserStatus userStatus;
    private UserType userType;
    private Collection<UserRole> userRoles;
    private boolean isactive;
    public UserDto(Integer id, String username) {
        this.id = id;
        this.username = username;
    }
}
