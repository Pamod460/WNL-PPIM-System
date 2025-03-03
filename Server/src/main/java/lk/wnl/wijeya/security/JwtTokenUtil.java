package lk.wnl.wijeya.security;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.Role;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Userrole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtTokenUtil {

    private final String secret;
    private final int expiration;
    @Autowired
    private UserDao userDao;

    public JwtTokenUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") int expiration) {
        this.secret = secret;
        this.expiration = expiration;
    }

    public String generateToken(UserDetails userDetails) {
        String username;
        Map<String, Object> claims = new HashMap<>();

        User user = userDao.findByUsername(userDetails.getUsername());
        if (user != null) {
            Collection<Userrole> userroles = user.getUserroles();
            List<Role> roles = userroles.stream().map(Userrole::getRole).collect(Collectors.toList());
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
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expirationDate = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getExpiration();
        return expirationDate.before(new Date());
    }
}
