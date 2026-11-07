package lk.wnl.wijeya.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lk.wnl.wijeya.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

class JwtTokenUtilTest {

    private static final String SECRET = "test-secret-0123456789-0123456789-0123456789-0123456789-0123456789-abcdef";

    private JwtTokenUtil util;
    private UserDetails kamal;

    @BeforeEach
    void setUp() {
        util = new JwtTokenUtil(SECRET, 3600);
        ReflectionTestUtils.setField(util, "userRepository", mock(UserRepository.class));
        kamal = User.withUsername("kamal").password("x")
                .authorities(new SimpleGrantedAuthority("employee-select"), new SimpleGrantedAuthority("user-insert"))
                .build();
    }

    @Test
    void weakSecretIsRejectedAtStartup() {
        assertThatThrownBy(() -> new JwtTokenUtil("mySecretKey", 3600))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least 64 bytes");
    }

    @Test
    void generatedTokenValidatesAndKeepsClaimsTheClientReads() {
        String token = util.generateToken(kamal);

        assertThat(util.extractUsername(token)).isEqualTo("kamal");
        assertThat(util.validateToken(token, kamal)).isTrue();

        // The Angular client reads "aud" as an array of authorities and "uname" as the display name.
        String payload = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
        assertThat(payload).contains("\"uname\":\"kamal\"");
        assertThat(payload).containsPattern("\"aud\":\\[\"(employee-select|user-insert)\",\"(employee-select|user-insert)\"\\]");
    }

    @Test
    void singleAuthorityStillSerializesAsArray() {
        UserDetails one = User.withUsername("sk").password("x").authorities("material-select").build();
        String payload = new String(Base64.getUrlDecoder().decode(util.generateToken(one).split("\\.")[1]), StandardCharsets.UTF_8);
        assertThat(payload).contains("\"aud\":[\"material-select\"]");
    }

    @Test
    void tokenSignedWithAnotherKeyIsRejected() {
        String forged = Jwts.builder().subject("kamal").expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(Keys.hmacShaKeyFor(SECRET.replace('a', 'b').getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS512)
                .compact();
        assertThatThrownBy(() -> util.extractUsername(forged)).isInstanceOf(JwtException.class);
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = util.generateToken(kamal);
        String[] parts = token.split("\\.");
        String evilPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"sub\":\"admin1\",\"exp\":9999999999}".getBytes(StandardCharsets.UTF_8));
        assertThatThrownBy(() -> util.extractUsername(parts[0] + "." + evilPayload + "." + parts[2]))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void rolesAreReadBackByUserService() {
        UserService userService = new UserService(mock(UserRepository.class));
        ReflectionTestUtils.setField(userService, "secret", SECRET);
        String token = Jwts.builder().subject("kamal")
                .claim("roles", List.of(java.util.Map.of("id", 1, "name", "Admin")))
                .expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS512)
                .compact();

        assertThat(userService.getRoles(token)).extracting("name").containsExactly("Admin");
    }
}
