package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.MaterialController;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.util.StandardResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Failed logins are 401 (not 500), duplicates are 409 (not 302), deletes are 200 (not 201).
 */
@WebMvcTest(controllers = MaterialController.class)
@Import(WebSecurityConfig.class)
class LoginAndStatusCodeTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private MaterialService materialService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    private static String login(String user, String pass) {
        return "{\"username\":\"" + user + "\",\"password\":\"" + pass + "\"}";
    }

    private void kamalExists() {
        when(userService.loadUserByUsername("kamal")).thenReturn(User.withUsername("kamal")
                .password(new BCryptPasswordEncoder().encode("OldPass1")).authorities("material-select").build());
    }

    @Test
    void correctLoginReturnsToken() throws Exception {
        kamalExists();
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON).content(login("kamal", "OldPass1")))
                .andExpect(status().isOk())
                .andExpect(header().string("Authorization", startsWith("Bearer ")));
    }

    @Test
    void wrongPasswordIs401BadCredentials() throws Exception {
        kamalExists();
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON).content(login("kamal", "nope")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Bad credentials"));
    }

    @Test
    void unknownUserIs401BadCredentials() throws Exception {
        when(userService.loadUserByUsername("ghost")).thenThrow(new UsernameNotFoundException("x"));
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON).content(login("ghost", "x")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Bad credentials"));
    }

    @Test
    void inactiveUserIs401WithLoginPageMessage() throws Exception {
        when(userService.loadUserByUsername("old")).thenThrow(new RuntimeException(
                "Access Denied/This user account is inactive. Please contact the System Administrator for support."));
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON).content(login("old", "x")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(startsWith("Access Denied/This user account is inactive")));
    }

    @Test
    void malformedLoginBodyIs401() throws Exception {
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON).content("not json"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "material-insert")
    void duplicateIs409Conflict() throws Exception {
        when(materialService.save(any())).thenThrow(new ResourceAlreadyExistException("Material already exists"));
        mockMvc.perform(post("/materials").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.data.message").value("Material already exists"));
    }

    @Test
    @WithMockUser(authorities = "material-delete")
    void deleteIs200() throws Exception {
        when(materialService.detele(1)).thenReturn(ResponseEntity.ok(new StandardResponse(200, "Deleted", null)));
        mockMvc.perform(delete("/materials/1")).andExpect(status().isOk());
    }
}
