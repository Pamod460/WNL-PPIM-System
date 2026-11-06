package lk.wnl.wijeya.util.userPasswdRequest;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Setter
@Getter
public class UserPasswdRequest {

    // Ignored by the server: the user is always taken from the JWT. Kept so old clients don't break.
    public String userName;

    @NotBlank(message = "Current password is required")
    public String currentPasswd;

    @NotBlank(message = "New password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    public String newPasswd;


}
