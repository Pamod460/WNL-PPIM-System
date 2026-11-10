package lk.wnl.wijeya.security;

import lk.wnl.wijeya.controller.AgentController;
import lk.wnl.wijeya.controller.MaterialController;
import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.service.MaterialService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** "Created by" comes from the login token, whatever the browser puts in "logger". */
@WebMvcTest(controllers = {MaterialController.class, AgentController.class})
@Import(WebSecurityConfig.class)
class LoggerFromTokenTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private MaterialService materialService;
    @MockBean private AgentService agentService;
    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;
    @MockBean private ModuleRepository moduleRepository;

    @Test
    @WithMockUser(username = "kamal", authorities = "material-insert")
    void loggedInUserCannotSaveAsSomeoneElse() throws Exception {
        mockMvc.perform(post("/materials").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ink\",\"logger\":\"Admin\"}"))
                .andExpect(status().isOk());

        ArgumentCaptor<MaterialDto> saved = ArgumentCaptor.forClass(MaterialDto.class);
        verify(materialService).save(saved.capture());
        assertThat(saved.getValue().getLogger()).isEqualTo("kamal");
    }

    @Test
    void publicRegistrationIsRecordedAsThePublicAccount() throws Exception {
        mockMvc.perform(post("/agents").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Kamal Perera\",\"nic\":\"200012345678\",\"mobile\":\"0771234567\","
                                + "\"email\":\"k@x.lk\",\"logger\":\"Admin\"}"))
                .andExpect(status().is2xxSuccessful());

        ArgumentCaptor<AgentDto> saved = ArgumentCaptor.forClass(AgentDto.class);
        verify(agentService).saveAgent(saved.capture());
        assertThat(saved.getValue().getLogger()).isEqualTo("Agent");
    }
}
