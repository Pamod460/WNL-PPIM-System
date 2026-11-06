package lk.wnl.wijeya.util.userPasswdRequest;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Pattern;

@Setter
@Getter
public class UserPasswdRequest {

    public String userName;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    public String newPasswd;


}
