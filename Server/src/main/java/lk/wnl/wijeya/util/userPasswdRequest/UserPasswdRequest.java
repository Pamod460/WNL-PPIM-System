package lk.wnl.wijeya.util.userPasswdRequest;

import javax.validation.constraints.Pattern;

public class UserPasswdRequest {

    public String userName;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    public String newPasswd;

    public UserPasswdRequest(){}

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNewPasswd() {
        return newPasswd;
    }

    public void setNewPasswd(String newPasswd) {
        this.newPasswd = newPasswd;
    }
}
