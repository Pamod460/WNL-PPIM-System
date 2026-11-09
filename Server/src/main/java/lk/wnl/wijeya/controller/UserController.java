package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
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

import javax.validation.Valid;
import java.security.Principal;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PreAuthorize("hasAnyAuthority('user-select', 'user-insert', 'user-update', 'user-delete')")
    @GetMapping(path = "/list", produces = "application/json")
    public List<UserDto> get(@RequestParam HashMap<String, String> params) {
        return userService.getAllUser(params);
    }


    @PreAuthorize("hasAuthority('user-insert')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody UserDto userDTO) {
        return userService.saveUser(userDTO);
    }

    @PreAuthorize("hasAuthority('user-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody UserDto userDTO) {
        return userService.updateUser(userDTO);
    }


    @PreAuthorize("hasAuthority('user-delete')")
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
    public ResponseEntity<StandardResponse> updateUserPasswd(@Valid @RequestBody UserPasswdRequest userPasswdRequest,
                                                             Principal principal) {
        // Only the logged-in user can change their own password; the username in the body is ignored.
        return userService.updateUserPassword(principal.getName(), userPasswdRequest);
    }

}