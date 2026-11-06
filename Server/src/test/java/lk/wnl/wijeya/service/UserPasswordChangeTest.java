package lk.wnl.wijeya.service;

import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.IMPL.UserServiceIMPL;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lk.wnl.wijeya.util.userPasswdRequest.UserPasswdRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserPasswordChangeTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private UserRepository userRepository;
    private UserServiceIMPL service;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        service = new UserServiceIMPL(mock(ObjectMapper.class), userRepository);
        user = new User();
        user.setId(7);
        user.setUsername("kamal");
        user.setPassword(encoder.encode("OldPass1"));
        when(userRepository.findByUsername("kamal")).thenReturn(user);
    }

    private static UserPasswdRequest request(String current, String next) {
        UserPasswdRequest r = new UserPasswdRequest();
        r.setCurrentPasswd(current);
        r.setNewPasswd(next);
        return r;
    }

    @Test
    void wrongCurrentPasswordIsRejectedAndNothingSaved() {
        ResponseEntity<StandardResponse> res = service.updateUserPassword("kamal", request("WrongPass1", "NewPass1"));

        assertThat(res.getStatusCodeValue()).isEqualTo(400);
        assertThat(res.getBody().getMessage()).isEqualTo("Current password is incorrect");
        verify(userRepository, never()).save(any());
    }

    @Test
    void sameAsCurrentPasswordIsRejected() {
        ResponseEntity<StandardResponse> res = service.updateUserPassword("kamal", request("OldPass1", "OldPass1"));

        assertThat(res.getStatusCodeValue()).isEqualTo(400);
        verify(userRepository, never()).save(any());
    }

    @Test
    void correctCurrentPasswordSavesNewHash() {
        ResponseEntity<StandardResponse> res = service.updateUserPassword("kamal", request("OldPass1", "NewPass1"));

        assertThat(res.getStatusCodeValue()).isEqualTo(200);
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertThat(encoder.matches("NewPass1", saved.getValue().getPassword())).isTrue();
    }
}
