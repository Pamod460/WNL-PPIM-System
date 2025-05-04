package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.dto.UserDto;
import lk.wnl.wijeya.util.regex.RegexProvider;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;



@CrossOrigin
@RestController
@RequestMapping(value = "/regexes")
public class RegexController {

    @GetMapping(path ="/employee", produces = "application/json")
    public HashMap<String, HashMap<String, String>> employee() {
        return RegexProvider.get(new EmployeeDto());
    }

    @GetMapping(path ="/users", produces = "application/json")
    public HashMap<String, HashMap<String, String>> user() {
        return RegexProvider.get(new UserDto());
    }
    @GetMapping(path ="/userpasswdrequest", produces = "application/json")
    public HashMap<String, HashMap<String, String>> UserPasswdRequest() {
        return RegexProvider.get(new UserPasswdRequest());
    }
    @GetMapping(path ="/material", produces = "application/json")
    public HashMap<String, HashMap<String, String>> material() {
        return RegexProvider.get(new MaterialDto());
    }


}


