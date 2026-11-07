package lk.wnl.wijeya.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lk.wnl.wijeya.controller.AgentController;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * A bad, expired or old-key token must give a clean 401 (not a 500 with a stack trace),
 * so the client drops it and sends the user to the login page.
 */
@WebMvcTest(controllers = AgentController.class)
@Import(WebSecurityConfig.class)
class InvalidTokenTest {

    // Same value as src/test/resources/application.properties
    private static final String SECRET = "test-secret-0123456789-0123456789-0123456789-0123456789-0123456789-abcdef";
    private static final String OLD_SECRET = "an-old-secret-that-the-server-no-longer-uses-0123456789-0123456789-xyz";

    @Autowired private MockMvc mockMvc;

    @MockBean private AgentService agentService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    private static String token(String secret, long expiresInMs) {
        return Jwts.builder().subject("kamal")
                .expiration(new Date(System.currentTimeMillis() + expiresInMs))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS512)
                .compact();
    }

    @Test
    void tokenSignedWithOldKeyGives401() throws Exception {
        mockMvc.perform(get("/agents").header("Authorization", "Bearer " + token(OLD_SECRET, 60000)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.data.message").exists());
    }

    @Test
    void expiredTokenGives401() throws Exception {
        mockMvc.perform(get("/agents").header("Authorization", "Bearer " + token(SECRET, -60000)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("JWT expired. Please log in again."));
    }

    @Test
    void garbageTokenGives401() throws Exception {
        mockMvc.perform(get("/agents").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenForDeletedUserGives401() throws Exception {
        when(userService.loadUserByUsername("kamal"))
                .thenThrow(new org.springframework.security.core.userdetails.UsernameNotFoundException("gone"));
        mockMvc.perform(get("/agents").header("Authorization", "Bearer " + token(SECRET, 60000)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validTokenStillWorks() throws Exception {
        when(userService.loadUserByUsername("kamal"))
                .thenReturn(User.withUsername("kamal").password("x").authorities("agent-select").build());
        mockMvc.perform(get("/agents").header("Authorization", "Bearer " + token(SECRET, 60000)))
                .andExpect(status().isOk());
    }
}
