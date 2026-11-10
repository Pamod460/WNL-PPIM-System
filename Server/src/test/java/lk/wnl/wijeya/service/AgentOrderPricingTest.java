package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.AgentOrderDto;
import lk.wnl.wijeya.entity.Agent;
import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.entity.AgentOrderProduct;
import lk.wnl.wijeya.entity.Product;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.AgentOrderRepository;
import lk.wnl.wijeya.repository.AgentRepository;
import lk.wnl.wijeya.repository.ProductRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.IMPL.AgentOrderServiceIMPL;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** The public order page can't pick another agent or set its own prices. */
@ExtendWith(MockitoExtension.class)
class AgentOrderPricingTest {

    @Mock private AgentOrderRepository agentOrderRepository;
    @Mock private ObjectMapper objectMapper;
    @Mock private UserRepository userRepository;
    @Mock private AgentRepository agentRepository;
    @Mock private ProductRepository productRepository;
    @InjectMocks private AgentOrderServiceIMPL service;

    @AfterEach
    void clearLogin() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void publicOrderWithWrongNicIsRejected() {
        when(objectMapper.toAgentOrder(any())).thenReturn(order(3, BigDecimal.ONE));
        when(agentRepository.findByNumberIgnoreCaseAndNic("AG001", "999999999V")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.saveAgentOrder(dto("AG001", "999999999V")))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("No agent found");
        verify(agentOrderRepository, never()).save(any());
    }

    @Test
    void publicOrderWithoutNicIsRejected() {
        when(objectMapper.toAgentOrder(any())).thenReturn(order(3, BigDecimal.ONE));

        assertThatThrownBy(() -> service.saveAgentOrder(dto("AG001", null)))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(agentOrderRepository, never()).save(any());
    }

    @Test
    void publicOrderUsesTheVerifiedAgentAndServerPrices() {
        // Browser says the line costs 1.00; the product's agent price is 25.00 x 3.
        AgentOrder order = order(3, BigDecimal.ONE);
        when(objectMapper.toAgentOrder(any())).thenReturn(order);
        Agent real = new Agent();
        real.setId(42);
        when(agentRepository.findByNumberIgnoreCaseAndNic("AG001", "200012345678")).thenReturn(Optional.of(real));
        when(productRepository.findById(7)).thenReturn(Optional.of(product(7, "25.00")));
        when(agentOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.saveAgentOrder(dto("AG001", "200012345678"));

        ArgumentCaptor<AgentOrder> saved = ArgumentCaptor.forClass(AgentOrder.class);
        verify(agentOrderRepository).save(saved.capture());
        assertThat(saved.getValue().getAgent().getId()).isEqualTo(42);
        assertThat(saved.getValue().getGrandTotal()).isEqualByComparingTo("75.00");
        assertThat(saved.getValue().getAgentOrderProducts().iterator().next().getLineTotal())
                .isEqualByComparingTo("75.00");
    }

    @Test
    void staffOrdersAreAlsoPricedFromProducts() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("kamal", null, List.of()));
        AgentOrder order = order(2, new BigDecimal("999"));
        when(objectMapper.toAgentOrder(any())).thenReturn(order);
        when(productRepository.findById(7)).thenReturn(Optional.of(product(7, "10.50")));
        when(agentOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.saveAgentOrder(dto(null, null));

        verifyNoInteractions(agentRepository);
        assertThat(order.getGrandTotal()).isEqualByComparingTo("21.00");
    }

    @Test
    void zeroQuantityIsRejected() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("kamal", null, List.of()));
        when(objectMapper.toAgentOrder(any())).thenReturn(order(0, BigDecimal.ZERO));

        assertThatThrownBy(() -> service.saveAgentOrder(dto(null, null)))
                .hasMessageContaining("quantity of at least 1");
    }

    private static AgentOrderDto dto(String number, String nic) {
        AgentOrderDto dto = new AgentOrderDto();
        Agent sent = new Agent();
        sent.setId(1);
        sent.setNumber(number);
        sent.setNic(nic);
        dto.setAgent(sent);
        dto.setLogger("Agent");
        return dto;
    }

    private static AgentOrder order(int qty, BigDecimal clientLineTotal) {
        AgentOrder order = new AgentOrder();
        order.setOrderNumber("AO-1");
        Agent claimed = new Agent();
        claimed.setId(1);
        order.setAgent(claimed);
        order.setGrandTotal(clientLineTotal);
        AgentOrderProduct line = new AgentOrderProduct();
        Product p = new Product();
        p.setId(7);
        line.setProduct(p);
        line.setQuantity(qty);
        line.setLineTotal(clientLineTotal);
        order.setAgentOrderProducts(new LinkedHashSet<>(List.of(line)));
        return order;
    }

    private static Product product(int id, String agentPrice) {
        Product p = new Product();
        p.setId(id);
        p.setAgentPrice(new BigDecimal(agentPrice));
        return p;
    }
}
