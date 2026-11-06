package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.UserController;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.util.StandardResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * PUT /users/user-passwd-update must change the logged-in user's password only.
 */
@WebMvcTest(controllers = UserController.class)
@Import(WebSecurityConfig.class)
class PasswordChangeEndpointTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private lk.wnl.wijeya.service.UserService userCrudService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    private static final String URL = "/users/user-passwd-update";

    @Test
    void anonymousIsBlocked() throws Exception {
        mockMvc.perform(put(URL).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"admin1\",\"currentPasswd\":\"x\",\"newPasswd\":\"NewPass1\"}"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(userCrudService);
    }

    @Test
    @WithMockUser(username = "kamal")
    void usernameInBodyIsIgnoredAndLoggedInUserIsUsed() throws Exception {
        when(userCrudService.updateUserPassword(any(), any()))
                .thenReturn(ResponseEntity.ok(new StandardResponse(200, "ok", null)));

        mockMvc.perform(put(URL).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"admin1\",\"currentPasswd\":\"OldPass1\",\"newPasswd\":\"NewPass1\"}"))
                .andExpect(status().isOk());

        verify(userCrudService).updateUserPassword(eq("kamal"), any());
        verify(userCrudService, never()).updateUserPassword(eq("admin1"), any());
    }

    @Test
    @WithMockUser(username = "kamal")
    void missingCurrentPasswordIsBadRequest() throws Exception {
        mockMvc.perform(put(URL).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"newPasswd\":\"NewPass1\"}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(userCrudService);
    }

    @Test
    @WithMockUser(username = "kamal")
    void weakNewPasswordIsBadRequest() throws Exception {
        mockMvc.perform(put(URL).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPasswd\":\"OldPass1\",\"newPasswd\":\"weak\"}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(userCrudService);
    }
}
