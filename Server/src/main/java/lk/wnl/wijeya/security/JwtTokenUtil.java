package lk.wnl.wijeya.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.entity.Role;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtTokenUtil {

    /** HS512 needs a key of at least 512 bits (64 bytes). */
    static final int MIN_SECRET_BYTES = 64;

    private final SecretKey key;
    private final int expiration;
    @Autowired
    private UserRepository userRepository;

    public JwtTokenUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") int expiration) {
        this.key = signingKey(secret);
        this.expiration = expiration;
    }

    static SecretKey signingKey(String secret) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
            throw new IllegalStateException("jwt.secret must be at least " + MIN_SECRET_BYTES
                    + " bytes. Set the JWT_SECRET environment variable (or application-local.properties), "
                    + "e.g. generate one with: openssl rand -base64 64");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Verifies the signature and expiry, then returns the claims. Throws JwtException if invalid. */
    static Claims parseClaims(SecretKey key, String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public Claims parseClaims(String token) {
        return parseClaims(key, token);
    }

    public String generateToken(UserDetails userDetails) {
        String username;
        Map<String, Object> claims = new HashMap<>();

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user != null) {
            Collection<UserRole> userRoles = user.getUserRoles();
            List<Role> roles = userRoles.stream().map(UserRole::getRole).collect(Collectors.toList());
            claims.put("roles", roles);
            username = user.getEmployee().getFullname();
        } else {
            username = userDetails.getUsername();
        }
        claims.put("uname",username);
        claims.put("aud", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expirationDate = parseClaims(token).getExpiration();
        return expirationDate.before(new Date());
    }
}
