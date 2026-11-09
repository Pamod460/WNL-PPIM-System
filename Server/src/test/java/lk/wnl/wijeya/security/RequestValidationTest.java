package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.AgentController;
import lk.wnl.wijeya.controller.VehicleController;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Request bodies are checked with @Valid; bad input is a 400 with the field message in data.message. */
@WebMvcTest(controllers = {AgentController.class, VehicleController.class})
@Import(WebSecurityConfig.class)
class RequestValidationTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private AgentService agentService;
    @MockBean private VehicleService vehicleService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    @Test
    void publicAgentRegistrationWithBadNicIs400AndNotSaved() throws Exception {
        mockMvc.perform(post("/agents").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Kamal Perera\",\"nic\":\"123\",\"mobile\":\"0771234567\",\"email\":\"k@x.lk\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.message").value("Invalid NIC"));
        verify(agentService, never()).saveAgent(any());
    }

    @Test
    void agentWithoutLandPhoneIsAccepted() throws Exception {
        mockMvc.perform(post("/agents").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Kamal Perera\",\"nic\":\"200012345678\",\"mobile\":\"0771234567\",\"land\":\"\",\"email\":\"k@x.lk\"}"))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @WithMockUser(authorities = "vehicle-insert")
    void vehicleNumbersAreValidatedWithoutCrashing() throws Exception {
        // These fields used to carry @Pattern on Integer, which throws a 500 as soon as @Valid runs.
        mockMvc.perform(post("/vehicles").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"number\":\"CAB-1234\",\"yom\":2015,\"capacity\":500,\"curruntMeterReading\":12000}"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/vehicles").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"number\":\"CAB-1234\",\"yom\":15,\"capacity\":500}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.message").value("Invalid YOM"));
    }

    @Test
    @WithMockUser(authorities = "vehicle-delete")
    void deletingARecordThatIsStillUsedIs409() throws Exception {
        when(vehicleService.deleteVehicle(1)).thenThrow(new DataIntegrityViolationException("fk"));
        mockMvc.perform(delete("/vehicles/1"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.data.message", containsString("in use")));
    }
}
