package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.dto.UserDto;
import lk.wnl.wijeya.dto.UserRoleDto;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import org.springframework.http.ResponseEntity;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

public interface UserService {
    List<UserDto> getAllUser(HashMap<String, String> params);

    ResponseEntity<StandardResponse> saveUser(UserDto userDTO);

    ResponseEntity<StandardResponse> deleteUser(String username);

    ResponseEntity<StandardResponse> updateUser(UserDto userDto);

    EmployeeDto getEmployeeByUsername(String username);

    Collection<UserRoleDto> getUserRoleByUsername(String username);

    ResponseEntity<StandardResponse> updateUserPassword(UserPasswdRequest userPasswdRequest);
}
