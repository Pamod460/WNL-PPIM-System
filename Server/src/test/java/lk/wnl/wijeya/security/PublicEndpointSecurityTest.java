package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.AgentController;
import lk.wnl.wijeya.controller.AgentOrderController;
import lk.wnl.wijeya.controller.ProductController;
import lk.wnl.wijeya.controller.UserController;
import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentOrderService;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Checks which endpoints are reachable without a JWT after locking down WebSecurityConfig.
 */
@WebMvcTest(controllers = {AgentController.class, AgentOrderController.class, ProductController.class, UserController.class})
@Import(WebSecurityConfig.class)
class PublicEndpointSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private AgentService agentService;
    @MockBean private AgentOrderService agentOrderService;
    @MockBean private ProductService productService;
    @MockBean private lk.wnl.wijeya.service.UserService userCrudService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    // ---- still public ----

    @Test
    void anonymousCanListProducts() throws Exception {
        mockMvc.perform(get("/products")).andExpect(status().isOk());
    }

    @Test
    void anonymousCanGetNextAgentOrderCode() throws Exception {
        mockMvc.perform(get("/agentorders/next")).andExpect(status().isOk());
    }

    @Test
    void anonymousCanVerifyAgentAndGetsNoPersonalData() throws Exception {
        when(agentService.verifyAgent(any())).thenReturn(new AgentDto(5, "AG005", null, "Test Agent"));
        mockMvc.perform(post("/agents/verify").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"number\":\"AG005\",\"nic\":\"200012345678\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.nic").doesNotExist());
    }

    @Test
    void verifyWithWrongDetailsReturns404() throws Exception {
        when(agentService.verifyAgent(any())).thenThrow(new ResourceNotFoundException("not found"));
        mockMvc.perform(post("/agents/verify").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"number\":\"AG999\",\"nic\":\"x\"}"))
                .andExpect(status().isNotFound());
    }

    // ---- now blocked for anonymous users ----

    @Test
    void anonymousCannotListAllAgents() throws Exception {
        mockMvc.perform(get("/agents")).andExpect(status().isForbidden());
        mockMvc.perform(get("/agents/list")).andExpect(status().isForbidden());
    }

    @Test
    void anonymousCannotDeleteOrUpdateAgents() throws Exception {
        mockMvc.perform(delete("/agents/1")).andExpect(status().isForbidden());
        mockMvc.perform(put("/agents").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void anonymousCannotChangeProductsOrOrders() throws Exception {
        mockMvc.perform(delete("/products/1")).andExpect(status().isForbidden());
        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/agentorders")).andExpect(status().isForbidden());
        mockMvc.perform(delete("/agentorders/1")).andExpect(status().isForbidden());
    }

    @Test
    void anonymousCannotReachUsers() throws Exception {
        mockMvc.perform(get("/users/list")).andExpect(status().isForbidden());
    }

    // ---- logged-in users still work ----

    @Test
    @WithMockUser
    void authenticatedUserCanListAgents() throws Exception {
        mockMvc.perform(get("/agents")).andExpect(status().isOk());
        mockMvc.perform(delete("/agents/1")).andExpect(status().isCreated());
    }
}
