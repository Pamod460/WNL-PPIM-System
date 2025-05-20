package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.EmployeeDto;
import lk.wnl.wijeya.dto.UserDto;
import lk.wnl.wijeya.dto.UserRoleDto;
import lk.wnl.wijeya.dto.UserStatusDto;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.UserRole;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.UserService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements UserService {
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<UserDto> getAllUser(HashMap<String, String> params) {
        List<User> userList = userRepository.findAllByIsactive(true);

        if (!userList.isEmpty()) {
            List<UserDto> userDtoList = objectMapper.toUserDtoList(userList);
            if (params.isEmpty()) {
                return userDtoList;
            } else {
                String employee = params.get("employee");
                String username = params.get("username");
                String roleid = params.get("roleid");
                String usrstatusid = params.get("usrstatusid");

                Stream<UserDto> stream = userDtoList.stream();

                if (employee != null) {
                    stream = stream.filter(u -> u.getEmployee().getCallingname().contains(employee));
                }
                if (username != null) {
                    stream = stream.filter(u -> u.getUsername().contains(username));
                }
                if (roleid != null) {
                    stream = stream.filter(u -> u.getUserRoles().stream().anyMatch(ur -> ur.getRole().getId() == Integer.parseInt(roleid)));
                }
                if (usrstatusid != null) {
                    stream = stream.filter(u -> u.getUserStatus().getId() == Integer.parseInt(usrstatusid));
                }
                return stream.collect(Collectors.toList());

            }
        } else {
            throw new ResourceNotFoundException("Users Not Found");
        }
    }

    @Override
    public ResponseEntity<StandardResponse> saveUser(UserDto userDto) {
        User loggeruser = userRepository.findByUsername(userDto.getLogger());
        if (userDto != null) {
            if (userRepository.findByUsername(userDto.getUsername()) != null)
                throw new ResourceAlreadyExistException("Existing Username");

            User user = objectMapper.toUser(userDto);
            user.setCreatedBy(loggeruser);

            for (UserRole u : user.getUserRoles()) u.setUser(user);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
            user.setIsactive(true);

            User savedUser = userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new StandardResponse(HttpStatus.CREATED.value(), "User Added Successfully", new UserDto(savedUser.getId(), savedUser.getUsername())));
        } else {
            throw new ResourceNotFoundException("User Not Found");
        }
    }

    @Override
    public ResponseEntity<StandardResponse> deleteUser(String username) {
        User exsistingUser = userRepository.findByUsername(username);
        if (exsistingUser == null)
            throw new ResourceNotFoundException("User Not Found");
        exsistingUser.setIsactive(false);
        exsistingUser.setUserStatus(objectMapper.toUseStatus(new UserStatusDto(2, "Inactive")));
        userRepository.save(exsistingUser);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "User Successfully Deleted", null));
    }

    @Override
    public EmployeeDto getEmployeeByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User does not exist");
        }
        return objectMapper.toEmployeeDto(user.getEmployee());
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Collection<UserRoleDto> getUserRoleByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User does not exist");
        }
        return objectMapper.toUserRoleDto(user.getUserRoles());
    }

    @Override
    public ResponseEntity<StandardResponse> updateUserPassword(UserPasswdRequest userPasswdRequest) {
        User existingUser = userRepository.findByUsername(userPasswdRequest.getUserName());

        if (existingUser == null) {
            throw new ResourceNotFoundException("User does not exist");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashPasswd = passwordEncoder.encode(userPasswdRequest.getNewPasswd());

        existingUser.setPassword(hashPasswd);

        userRepository.save(existingUser);

        return ResponseEntity.ok(new StandardResponse(
                HttpStatus.OK.value(),
                "Password updated successfully",
                Map.of("id", existingUser.getId(), "url", "/users/" + existingUser.getId())
        ));
    }

    @Override
    public ResponseEntity<StandardResponse> updateUser(UserDto userDto) {
        User existingUser = userRepository.findByUsername(userDto.getUsername());

        if (existingUser == null) {
            throw new ResourceNotFoundException("User Not Found");
        }

        // Check if a user with the same username already exists (excluding current user)
        if (userRepository.existsByUsernameAndIdNot(userDto.getUsername(), userDto.getId())) {
            throw new ResourceAlreadyExistException("Username Already Exists");
        }

        try {
            // Update roles
            existingUser.getUserRoles().clear();
            userDto.getUserRoles().forEach(newUserRole -> {
                newUserRole.setUser(existingUser);
                existingUser.getUserRoles().add(newUserRole);
            });

            // Preserve active status
            userDto.setIsactive(existingUser.isIsactive());

            // Copy properties except sensitive ones
            BeanUtils.copyProperties(userDto, existingUser, "id", "password", "userRoles");

            // Password update logic
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()
                    && !userDto.getPassword().equals("WaterBoard@25")) {

                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                if (!passwordEncoder.matches(userDto.getPassword(), existingUser.getPassword())) {
                    String hashedPassword = passwordEncoder.encode(userDto.getPassword());
                    existingUser.setPassword(hashedPassword);
                }
            }

            // Save updated user
            User updatedUser = userRepository.save(existingUser);

            return ResponseEntity.ok(new StandardResponse(
                    HttpStatus.OK.value(), "User Updated Successfully", new UserDto(updatedUser.getId(), updatedUser.getUsername())
            ));
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }
}
