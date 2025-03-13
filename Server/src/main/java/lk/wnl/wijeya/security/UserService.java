package lk.wnl.wijeya.security;

import lk.wnl.wijeya.dao.ModuleDao;
import lk.wnl.wijeya.dao.UserDao;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.Userrole;
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

    final UserDao userdao;

    @Autowired
    public UserService(UserDao userdao) {
        this.userdao = userdao;
    }

    @Autowired
    private ModuleDao moduleDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.equals("Admin")) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Module> modules = moduleDao.findAll();
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
            String userStatus = user.getUsestatus().getName();
            if (userStatus.equalsIgnoreCase("inactive")){
                throw new RuntimeException("Access Denied/This user account is inactive. Please contact the System Administrator for support.");
            }
            if (userStatus.equalsIgnoreCase("blocked")){
                throw new RuntimeException("Access Denied/This user account is blocked. Please contact the System Administrator for support.");
            }

            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Userrole> userroles = (List<Userrole>) user.getUserroles();

            for(Userrole u : userroles){
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
