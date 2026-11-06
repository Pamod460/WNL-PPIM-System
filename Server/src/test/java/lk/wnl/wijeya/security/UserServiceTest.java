package lk.wnl.wijeya.security;

import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.entity.Role;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.UserRole;
import lk.wnl.wijeya.entity.UserStatus;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Login lookup must only use real DB users: no built-in Admin/Admin1234 account.
 * The only exception is the first-run setup admin, which needs an empty user table
 * and a password from SETUP_ADMIN_PASSWORD.
 */
class UserServiceTest {

    private UserRepository userRepository;
    private ModuleRepository moduleRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        moduleRepository = mock(ModuleRepository.class);
        userService = new UserService(userRepository);
        ReflectionTestUtils.setField(userService, "moduleRepository", moduleRepository);
        when(moduleRepository.findAll()).thenReturn(List.of(module("Employee"), module("Material")));
    }

    @Test
    void builtInAdminNoLongerExists() {
        when(userRepository.findByUsername("Admin")).thenReturn(null);
        assertThatThrownBy(() -> userService.loadUserByUsername("Admin"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void dbUserWithAdminRoleGetsAllModuleAuthorities() {
        User admin = user("admin1", "$2a$10$hash", "Active", role("Admin"));
        when(userRepository.findByUsername("admin1")).thenReturn(admin);

        UserDetails details = userService.loadUserByUsername("admin1");

        assertThat(details.getPassword()).isEqualTo("$2a$10$hash");
        assertThat(names(details)).contains(
                "employee-select", "employee-insert", "employee-update", "employee-delete",
                "material-select", "material-insert", "material-update", "material-delete");
    }

    @Test
    void normalUserOnlyGetsOwnPrivileges() {
        Role storeKeeper = role("Store Keeper", "material-select");
        when(userRepository.findByUsername("sk")).thenReturn(user("sk", "x", "Active", storeKeeper));

        assertThat(names(userService.loadUserByUsername("sk"))).containsExactly("material-select");
    }

    @Test
    void blockedUserIsRejected() {
        when(userRepository.findByUsername("b")).thenReturn(user("b", "x", "Blocked", role("Admin")));
        assertThatThrownBy(() -> userService.loadUserByUsername("b"))
                .hasMessageContaining("blocked");
    }

    @Test
    void setupAdminWorksOnlyWhenUserTableIsEmptyAndPasswordIsSet() {
        enableSetupAdmin("S3tup!Pass");
        when(userRepository.findByUsername("Admin")).thenReturn(null);
        when(userRepository.count()).thenReturn(0L);

        UserDetails details = userService.loadUserByUsername("Admin");

        assertThat(new BCryptPasswordEncoder().matches("S3tup!Pass", details.getPassword())).isTrue();
        assertThat(names(details)).contains("employee-insert", "material-delete");
    }

    @Test
    void setupAdminSwitchesOffOnceAnyUserExists() {
        enableSetupAdmin("S3tup!Pass");
        when(userRepository.findByUsername("Admin")).thenReturn(null);
        when(userRepository.count()).thenReturn(1L);

        assertThatThrownBy(() -> userService.loadUserByUsername("Admin"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void setupAdminIsOffWhenNoPasswordConfigured() {
        enableSetupAdmin("");
        when(userRepository.findByUsername("Admin")).thenReturn(null);
        when(userRepository.count()).thenReturn(0L);

        assertThatThrownBy(() -> userService.loadUserByUsername("Admin"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    // ---- helpers ----

    private void enableSetupAdmin(String password) {
        ReflectionTestUtils.setField(userService, "setupAdminUsername", "Admin");
        ReflectionTestUtils.setField(userService, "setupAdminPassword", password);
    }

    private static Set<String> names(UserDetails d) {
        return d.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    }

    private static Module module(String name) {
        Module m = new Module();
        m.setName(name);
        return m;
    }

    private static Role role(String name, String... authorities) {
        Role r = new Role();
        r.setName(name);
        r.setPrivileges(java.util.Arrays.stream(authorities).map(a -> {
            Privilege p = new Privilege();
            p.setAuthority(a);
            return p;
        }).collect(Collectors.toList()));
        return r;
    }

    private static User user(String username, String password, String status, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);
        UserStatus s = new UserStatus();
        s.setName(status);
        u.setUserStatus(s);
        UserRole ur = new UserRole();
        ur.setRole(role);
        ur.setUser(u);
        u.setUserRoles(List.of(ur));
        return u;
    }
}
