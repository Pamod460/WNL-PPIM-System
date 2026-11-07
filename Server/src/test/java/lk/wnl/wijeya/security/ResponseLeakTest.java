package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.UserController;
import lk.wnl.wijeya.dto.UserDto;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * API responses must not expose password hashes or exception internals.
 */
@WebMvcTest(controllers = UserController.class)
@Import(WebSecurityConfig.class)
@WithMockUser
class ResponseLeakTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private lk.wnl.wijeya.service.UserService userCrudService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    @Test
    void userListDoesNotContainPasswordHash() throws Exception {
        UserDto dto = new UserDto();
        dto.setId(1);
        dto.setUsername("kamal");
        dto.setPassword("$2a$10$abcdefghijklmnopqrstuv");
        when(userCrudService.getAllUser(any())).thenReturn(List.of(dto));

        mockMvc.perform(get("/users/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("kamal"))
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(content().string(not(containsString("$2a$"))));
    }

    @Test
    void notFoundErrorHasMessageButNoStackTrace() throws Exception {
        when(userCrudService.getAllUser(any())).thenThrow(new ResourceNotFoundException("Users Not Found"));

        mockMvc.perform(get("/users/list"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.data.message").value("Users Not Found"))
                .andExpect(jsonPath("$.data.stackTrace").doesNotExist())
                .andExpect(content().string(not(containsString("lk.wnl.wijeya"))));
    }

    @Test
    void passwordIsStillAcceptedInRequests() throws Exception {
        UserDto parsed = new com.fasterxml.jackson.databind.ObjectMapper()
                .readValue("{\"username\":\"new\",\"password\":\"Secret123\"}", UserDto.class);
        org.assertj.core.api.Assertions.assertThat(parsed.getPassword()).isEqualTo("Secret123");
    }
}
