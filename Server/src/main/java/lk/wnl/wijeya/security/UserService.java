package lk.wnl.wijeya.security;

import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    final UserRepository userdao;

    @Autowired
    public UserService(UserRepository userdao) {
        this.userdao = userdao;
    }

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.equals("Admin")) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Module> modules = moduleRepository.findAll();
            String[] operations = {"select","insert","update","delete"};

            for (Module module : modules){
                for (String op : operations){
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
        }
        else {

            User user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username " + username);
            }
            String userStatus = user.getUserStatus().getName();
            if (userStatus.equalsIgnoreCase("inactive")){
                throw new RuntimeException("Access Denied/This user account is inactive. Please contact the System Administrator for support.");
            }
            if (userStatus.equalsIgnoreCase("blocked")){
                throw new RuntimeException("Access Denied/This user account is blocked. Please contact the System Administrator for support.");
            }

            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<UserRole> userRoles = (List<UserRole>) user.getUserRoles();

            for(UserRole u : userRoles){
                List<Privilege> privileges = (List<Privilege>) u.getRole().getPrivileges();
                for (Privilege p:privileges){
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
