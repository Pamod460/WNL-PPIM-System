package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.AgentController;
import lk.wnl.wijeya.controller.AgentOrderController;
import lk.wnl.wijeya.controller.MaterialController;
import lk.wnl.wijeya.controller.PrivilegeController;
import lk.wnl.wijeya.controller.UserController;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentOrderService;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.service.PrivilegeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Write operations need the matching "<module>-<operation>" privilege (same strings the
 * Privilege screen generates). Reads used by other screens stay open to any logged-in user.
 */
@WebMvcTest(controllers = {MaterialController.class, UserController.class, PrivilegeController.class,
        AgentController.class, AgentOrderController.class})
@Import(WebSecurityConfig.class)
class RoleAuthorizationTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private MaterialService materialService;
    @MockBean private PrivilegeService privilegeService;
    @MockBean private AgentService agentService;
    @MockBean private AgentOrderService agentOrderService;
    @MockBean private lk.wnl.wijeya.service.UserService userCrudService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    private static final String JSON = "{}";

    @Test
    @WithMockUser(authorities = "paper-insert")
    void writeWithoutModulePrivilegeIs403WithMessage() throws Exception {
        mockMvc.perform(post("/materials").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.data.message").value("You do not have permission to perform this action."));
        mockMvc.perform(put("/materials").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/materials/1")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = {"material-insert", "material-update", "material-delete"})
    void writeWithModulePrivilegeIsAllowed() throws Exception {
        mockMvc.perform(post("/materials").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isOk());
        mockMvc.perform(put("/materials").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isOk());
        mockMvc.perform(delete("/materials/1")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "material-insert")
    void insertPrivilegeDoesNotAllowDelete() throws Exception {
        mockMvc.perform(delete("/materials/1")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void lookupReadsStayOpenToLoggedInUsers() throws Exception {
        mockMvc.perform(get("/materials/list")).andExpect(status().isOk());
        mockMvc.perform(get("/agents/list")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "material-select")
    void userAndPrivilegeListsNeedThoseModules() throws Exception {
        mockMvc.perform(get("/users/list")).andExpect(status().isForbidden());
        mockMvc.perform(get("/privileges")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = {"user-select", "privilege-select"})
    void userAndPrivilegeListsWorkWithPrivilege() throws Exception {
        mockMvc.perform(get("/users/list")).andExpect(status().isOk());
        mockMvc.perform(get("/privileges")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "kamal")
    void anyUserCanChangeOwnPassword() throws Exception {
        mockMvc.perform(put("/users/user-passwd-update").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPasswd\":\"OldPass1\",\"newPasswd\":\"NewPass1\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void publicRegistrationAndOrderStillWorkAnonymously() throws Exception {
        mockMvc.perform(post("/agents").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/agentorders").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @WithMockUser
    void agentUpdateNeedsPrivilege() throws Exception {
        mockMvc.perform(put("/agents").contentType(MediaType.APPLICATION_JSON).content(JSON))
                .andExpect(status().isForbidden());
    }
}
