package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Userrole;
import lk.wnl.wijeya.entity.Usestatus;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private UserDao userdao;

    @GetMapping(path = "/list", produces = "application/json")
    public List<User> get(@RequestParam HashMap<String, String> params) {
        List<User> users = this.userdao.findAllByIsactive(true);

        if (params.isEmpty()) {
            return users;
        } else {
            String employee = params.get("employee");
            String username = params.get("username");
            String roleid = params.get("roleid");
            String usrstatusid = params.get("usrstatusid");

            Stream<User> ustream = users.stream();

            if (employee != null) {
                ustream = ustream.filter(u -> u.getEmployee().getCallingname().contains(employee));
            }
            if (username != null) {
                ustream = ustream.filter(u -> u.getUsername().contains(username));
            }
            if (roleid != null) {
                ustream = ustream.filter(u -> u.getUserroles().stream().anyMatch(ur -> ur.getRole().getId() == Integer.parseInt(roleid)));
            }
            if (usrstatusid != null) {
                ustream = ustream.filter(u -> u.getUsestatus().getId() == Integer.parseInt(usrstatusid));
            }
            return ustream.collect(Collectors.toList());

        }
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody User user) {
        if (userdao.findByUsername(user.getUsername()) != null)
            throw new ResourceAlreadyExistException("Existing Username");

        for (Userrole u : user.getUserroles()) u.setUser(user);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setIsactive(true);

        User usr = userdao.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "User Added Successfully", usr));
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody User user) {
        User existingUser = userdao.findByUsername(user.getUsername());

        if (existingUser == null) {
            throw new ResourceNotFoundException("User Not Found");
        }

        // Check if a user with the same username already exists (excluding current user)
        if (userdao.existsByUsernameAndIdNot(user.getUsername(), user.getId())) {
            throw new ResourceAlreadyExistException("Username Already Exists");
        }

        try {
            // Update roles
            existingUser.getUserroles().clear();
            user.getUserroles().forEach(newUserRole -> {
                newUserRole.setUser(existingUser);
                existingUser.getUserroles().add(newUserRole);
            });

            // Preserve active status
            user.setIsactive(existingUser.isIsactive());

            // Copy properties except sensitive ones
            BeanUtils.copyProperties(user, existingUser, "id", "password", "userroles");

            // Password update logic
            if (user.getPassword() != null && !user.getPassword().isEmpty()
                    && !user.getPassword().equals("WaterBoard@25")) {

                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                    String hashedPassword = passwordEncoder.encode( user.getPassword());
                    existingUser.setPassword(hashedPassword);
                }
            }

            // Save updated user
            User updatedUser = userdao.save(existingUser);

            return ResponseEntity.ok(new StandardResponse(
                    HttpStatus.OK.value(), "User Updated Successfully", updatedUser
            ));
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }


    @DeleteMapping("/{username}")
    public ResponseEntity<StandardResponse> delete(@PathVariable String username) {
        User exsistingUser = userdao.findByUsername(username);
        if (exsistingUser == null)
            throw new ResourceNotFoundException("User Not Found");
        exsistingUser.setIsactive(false);
        exsistingUser.setUsestatus(new Usestatus(2,"Inactive"));
        userdao.save(exsistingUser);
        return ResponseEntity.ok(new StandardResponse(HttpStatus.OK.value(), "User Successfully Deleted", null));
    }

    @GetMapping("/empbyuser/{username}")
    public Employee get(@PathVariable String username) {
        User user = userdao.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User does not exist");
        }
        return user.getEmployee();
    }

    @GetMapping("/userRole/{username}")
    public Collection<Userrole> getUser(@PathVariable String username) {
        User user = userdao.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User does not exist");
        }
        return user.getUserroles();
    }

    @PutMapping("/user-passwd-update")
    public ResponseEntity<StandardResponse> updateUserPasswd(@RequestBody UserPasswdRequest userPasswdRequest) {

        User existingUser = userdao.findByUsername(userPasswdRequest.getUserName());

        if (existingUser == null) {
            throw new ResourceNotFoundException("User does not exist");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashPasswd = passwordEncoder.encode(userPasswdRequest.getNewPasswd());

        existingUser.setPassword(hashPasswd);

        userdao.save(existingUser);

        return ResponseEntity.ok(new StandardResponse(
                HttpStatus.OK.value(),
                "Password updated successfully",
                Map.of("id", existingUser.getId(), "url", "/users/" + existingUser.getId())
                ));
}

}