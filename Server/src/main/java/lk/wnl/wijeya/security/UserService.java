package lk.wnl.wijeya.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements UserDetailsService {

    final UserRepository userdao;

    @Autowired
    public UserService(UserRepository userdao) {
        this.userdao = userdao;
    }

    @Autowired
    private ModuleRepository moduleRepository;
    @Value("${jwt.secret}")
    private String secret;
    public List<RoleDto> getRoles(String token) {
        List<RoleDto> roles = new ArrayList<>();

        // 🛡️ Check if token is present
        if (token == null || token.isBlank()) {
            // Fallback: in-memory user role (e.g., hardcoded Admin)
            RoleDto fallbackRole = new RoleDto();
            fallbackRole.setId(1); // Assuming 1 = Admin
            fallbackRole.setName("Admin");
            roles.add(fallbackRole);
            return roles;
        }

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            List<Map<String, Object>> rawRoles = claims.get("roles", List.class);
            if (rawRoles != null) {
                for (Map<String, Object> map : rawRoles) {
                    RoleDto role = new RoleDto();
                    role.setId((Integer) map.get("id"));
                    role.setName((String) map.get("name"));
                    roles.add(role);
                }
            }
        } catch (Exception ex) {
            // Token is invalid, expired, or malformed — fallback for in-memory user
            RoleDto fallbackRole = new RoleDto();
            fallbackRole.setId(1); // Assuming 1 = Admin
            fallbackRole.setName("Admin");
            roles.add(fallbackRole);
        }

        return roles;
    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.equals("Admin")) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Module> modules = moduleRepository.findAll();
            String[] operations = {"select", "insert", "update", "delete"};

            for (Module module : modules) {
                for (String op : operations) {
                    String authority = module.getName().toLowerCase() + "-" + op;
                    authorities.add(new SimpleGrantedAuthority(authority));
                }
            }

            return org.springframework.security.core.userdetails.User
                    .withUsername("Admin")
                    .password(new BCryptPasswordEncoder().encode("Admin1234"))
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        } else {

            User user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username " + username);
            }
            String userStatus = user.getUserStatus().getName();
            if (userStatus.equalsIgnoreCase("inactive")) {
                throw new RuntimeException("Access Denied/This user account is inactive. Please contact the System Administrator for support.");
            }
            if (userStatus.equalsIgnoreCase("blocked")) {
                throw new RuntimeException("Access Denied/This user account is blocked. Please contact the System Administrator for support.");
            }

            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<UserRole> userRoles = (List<UserRole>) user.getUserRoles();

            for (UserRole u : userRoles) {
                List<Privilege> privileges = (List<Privilege>) u.getRole().getPrivileges();
                for (Privilege p : privileges) {
                    authorities.add(new SimpleGrantedAuthority(p.getAuthority()));
                }
            }

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }
    }
}
