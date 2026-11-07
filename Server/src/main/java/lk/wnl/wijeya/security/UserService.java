package lk.wnl.wijeya.security;

import io.jsonwebtoken.*;
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
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@Service
public class UserService implements UserDetailsService {

    private static final String ADMIN_ROLE = "Admin";

    final UserRepository userdao;

    @Autowired
    public UserService(UserRepository userdao) {
        this.userdao = userdao;
    }

    @Autowired
    private ModuleRepository moduleRepository;
    @Value("${jwt.secret}")
    private String secret;

    @Value("${app.setup-admin.username:Admin}")
    private String setupAdminUsername;

    @Value("${app.setup-admin.password:}")
    private String setupAdminPassword;

    private String setupAdminPasswordHash;
 public List<RoleDto> getRoles(String token) {
        List<RoleDto> roles = new ArrayList<>();

        if (token == null || token.isBlank()) {
            return roles;
        }

        try {
            Claims claims = JwtTokenUtil.parseClaims(JwtTokenUtil.signingKey(secret), token);

            List<Map<String, Object>> rawRoles = claims.get("roles", List.class);
            if (rawRoles != null) {
                for (Map<String, Object> map : rawRoles) {
                    RoleDto role = new RoleDto();
                    role.setId((Integer) map.get("id"));
                    role.setName((String) map.get("name"));
                    roles.add(role);
                }
            }
        } catch (ExpiredJwtException ex) {
            throw new RuntimeException("JWT token is expired", ex);
        } catch (JwtException ex) {
            throw new RuntimeException("JWT token is invalid", ex);
        } catch (Exception ex) {
            throw new RuntimeException("JWT processing error", ex);
        }

        return roles;
    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userdao.findByUsername(username);
        if (user == null) {
            if (isSetupAdminLogin(username)) {
                return setupAdmin();
            }
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
        boolean isAdmin = false;

        for (UserRole u : user.getUserRoles()) {
            if (ADMIN_ROLE.equalsIgnoreCase(u.getRole().getName())) {
                isAdmin = true;
            }
            for (Privilege p : u.getRole().getPrivileges()) {
                authorities.add(new SimpleGrantedAuthority(p.getAuthority()));
            }
        }

        // Users with the "Admin" role get every module/operation, like the old built-in
        // Admin account did, but they are real DB users with a hashed password that can be
        // changed, blocked or deactivated.
        if (isAdmin) {
            authorities.addAll(allModuleAuthorities());
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

    /**
     * First-run setup login. Only works while the user table is completely empty AND a
     * password has been supplied through the SETUP_ADMIN_PASSWORD environment variable
     * (app.setup-admin.password). As soon as one real user exists it switches itself off.
     */
    private boolean isSetupAdminLogin(String username) {
        return setupAdminPassword != null && !setupAdminPassword.isBlank()
                && username.equals(setupAdminUsername)
                && userdao.count() == 0;
    }

    private UserDetails setupAdmin() {
        log.warn("Setup admin '{}' logged in because the user table is empty. "
                + "Create a real user with the Admin role, then remove SETUP_ADMIN_PASSWORD.", setupAdminUsername);
        if (setupAdminPasswordHash == null) {
            setupAdminPasswordHash = new BCryptPasswordEncoder().encode(setupAdminPassword);
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(setupAdminUsername)
                .password(setupAdminPasswordHash)
                .authorities(allModuleAuthorities())
                .build();
    }

    private Set<SimpleGrantedAuthority> allModuleAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        String[] operations = {"select", "insert", "update", "delete"};
        for (Module module : moduleRepository.findAll()) {
            for (String op : operations) {
                authorities.add(new SimpleGrantedAuthority(module.getName().toLowerCase() + "-" + op));
            }
        }
        return authorities;
    }
}
