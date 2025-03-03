package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Userrole;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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
    public HashMap<String, String> add(@RequestBody User user) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (userdao.findByUsername(user.getUsername()) != null)
            errors = errors + "<br> Existing Username";

        if (errors == "") {
            for (Userrole u : user.getUserroles()) u.setUser(user);

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // Encrypt UserName and Password with Salt
            String salt = passwordEncoder.encode(user.getUsername());
            String hashedPassword = passwordEncoder.encode(salt + user.getPassword());
            user.setSalt(salt);
            user.setPassword(hashedPassword);
            userdao.save(user);

            responce.put("id", String.valueOf(user.getId()));
            responce.put("url", "/users/" + user.getId());
            responce.put("errors", errors);

            return responce;
        } else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(user.getId()));
        responce.put("url", "/users/" + user.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody User user) {
        HashMap<String, String> response = new HashMap<>();

        String errors = "";

        User extUser = userdao.findByUsername(user.getUsername());

        if (extUser != null) {

            // Update Existing User Roles
            try {
                extUser.getUserroles().clear();
                user.getUserroles().forEach(newUserRole -> {
                    newUserRole.setUser(extUser);
                    extUser.getUserroles().add(newUserRole);
                    newUserRole.setUser(extUser);
                });
                user.setIsactive(extUser.getIsactive());
                BeanUtils.copyProperties(user, extUser, "id", "password", "salt", "userroles");
                if (user.getPassword() != null && !user.getPassword().isEmpty()
                        && !user.getPassword().equals("WaterBoard@25")) {
                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                    // Encrypt UserName and Password with Salt
                    String salt = passwordEncoder.encode(user.getUsername());
                    String hashedPassword = passwordEncoder.encode(salt + user.getPassword());
                    extUser.setSalt(salt);
                    extUser.setPassword(hashedPassword);
                }

                // Update basic user properties
                userdao.save(extUser); // Save the updated extUser object

                response.put("id", String.valueOf(user.getId()));
                response.put("url", "/users/" + user.getId());
                response.put("errors", errors);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return response;
    }

    @DeleteMapping("/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable String username) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        User use1 = userdao.findByUsername(username);

        if (use1 == null)
            errors = errors + "<br> User Does Not Existed";

        if (errors == "") {
            use1.setIsactive(false);
            userdao.save(use1);
        } else errors = "Server Validation Errors : <br> " + errors;

        responce.put("username", String.valueOf(username));
        responce.put("url", "/users/" + username);
        responce.put("errors", errors);

        return responce;
    }

    @GetMapping(path = "/empbyuser/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public Object get(@PathVariable String username) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        User user = userdao.findByUsername(username);

        if (user == null)
            errors = errors + "<br> User Does Not Exist";

        if (errors.isEmpty()) {
            return user.getEmployee(); // Return the Employee object
        } else {
            errors = "Server Validation Errors : <br> " + errors;
            response.put("username", username);
            response.put("url", "/users/" + username);
            response.put("errors", errors);
            return response; // Return the error response
        }
    }

    @GetMapping(path = "/userRole/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public Object getUser(@PathVariable String username) {


        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        User user = userdao.findByUsername(username);

        if (user == null)
            errors = errors + "<br> User Does Not Exist";

        if (errors.isEmpty()) {
            return user.getUserroles(); // Return the Employee object
        } else {
            errors = "Server Validation Errors : <br> " + errors;
            response.put("username", username);
            response.put("url", "/users/" + username);
            response.put("errors", errors);
            return response; // Return the error response
        }
    }

    @PutMapping("/user-passwd-update")
    public HashMap<String, String> updateUserPasswd(@RequestBody UserPasswdRequest userPasswdRequest) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        User foundedUser = userdao.findByUsername(userPasswdRequest.getUserName());

        if (foundedUser == null) {
            errors = errors + "<br> User Does Not Exist";
            response.put("errors", errors);
        }

        if (errors.isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String salt = passwordEncoder.encode(userPasswdRequest.getUserName());
            String hashPasswd = passwordEncoder.encode(salt + userPasswdRequest.getNewPasswd());

            foundedUser.setSalt(salt);
            foundedUser.setPassword(hashPasswd);

            userdao.save(foundedUser);

            response.put("id", String.valueOf(foundedUser.getId()));
            response.put("url", "/users/" + foundedUser.getId());

        }
        return response;
    }

}
