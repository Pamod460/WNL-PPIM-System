package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.dto.UserDto;
import lk.wnl.wijeya.dto.UserRoleDto;
import lk.wnl.wijeya.service.UserService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping(path = "/list", produces = "application/json")
    public List<UserDto> get(@RequestParam HashMap<String, String> params) {
        return userService.getAllUser(params);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody UserDto userDTO) {
        return userService.saveUser(userDTO);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody UserDto userDTO) {
        return userService.updateUser(userDTO);
    }


    @DeleteMapping("/{username}")
    public ResponseEntity<StandardResponse> delete(@PathVariable String username) {
        return userService.deleteUser(username);
    }

    @GetMapping("/empbyuser/{username}")
    public EmployeeDto get(@PathVariable String username) {
        return userService.getEmployeeByUsername(username);
    }

    @GetMapping("/userRole/{username}")
    public Collection<UserRoleDto> getUser(@PathVariable String username) {
        return userService.getUserRoleByUsername(username);
    }

    @PutMapping("/user-passwd-update")
    public ResponseEntity<StandardResponse> updateUserPasswd(@RequestBody UserPasswdRequest userPasswdRequest) {
        return userService.updateUserPassword(userPasswdRequest);
    }

}