package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentOrderDto;
import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.entity.AgentOrderProduct;
import lk.wnl.wijeya.entity.Distribution;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.entity.Agent;
import lk.wnl.wijeya.entity.Product;
import lk.wnl.wijeya.repository.AgentOrderRepository;
import lk.wnl.wijeya.repository.AgentRepository;
import lk.wnl.wijeya.repository.ProductRepository;
import lk.wnl.wijeya.security.CurrentUser;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentOrderService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class AgentOrderServiceIMPL implements AgentOrderService {
    private final AgentOrderRepository agentOrderRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final AgentRepository agentRepository;
    private final ProductRepository productRepository;

    @Override
    public List<AgentOrderDto> getAll() {
        return objectMapper.toAgentOrderDtoList(agentOrderRepository.findAll()).stream().map(
                agentOrder -> new AgentOrderDto(agentOrder.getId(), agentOrder.getOrderNumber())
        ).collect(Collectors.toList());
    }

    @Override
    public List<AgentOrderDto> getAllAgentOrders(HashMap<String, String> params) {
        List<AgentOrder> agentOrders = this.agentOrderRepository.findAll();
        if (params.isEmpty()) return objectMapper.toAgentOrderDtoList(agentOrders);

        Stream<AgentOrder> stream = agentOrders.stream();

        String number = params.get("number");
        String date = params.get("date");
        String statusid = params.get("statusid");

        if (number != null) stream = stream.filter(a -> a.getOrderNumber().equalsIgnoreCase(number));
        if (date != null) stream = stream.filter(a -> a.getOrderDate().toString().equals(date));
        if (statusid != null) stream = stream.filter(a -> a.getAgentOrderStatus().getId().toString().equals(statusid));

        return objectMapper.toAgentOrderDtoList(stream.collect(Collectors.toList()));

    }

    @Override
    public ResponseEntity<Map<String, String>> getNextAgentOrder() {
        AgentOrder distribution = agentOrderRepository.findTopByOrderByIdDesc();

        int nextNumber = (distribution != null) ? distribution.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode= String.format("AGO-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<StandardResponse> saveAgentOrder(AgentOrderDto agentOrderDto) {
        AgentOrder agentOrder = objectMapper.toAgentOrder(agentOrderDto);
        agentOrder.setCreatedBy(userRepository.findByUsername(agentOrderDto.getLogger()));
        if (agentOrderRepository.existsByOrderNumber(agentOrder.getOrderNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }
        if (CurrentUser.isAnonymous()) {
            // Public order page: the agent must prove who they are again, here on the server.
            agentOrder.setAgent(verifiedAgent(agentOrderDto.getAgent()));
        }
        for (AgentOrderProduct product : agentOrder.getAgentOrderProducts()) {
            product.setAgentOrder(agentOrder);
        }
        priceFromProducts(agentOrder);

        AgentOrder savedAgentOrder = agentOrderRepository.save(agentOrder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Order Added Successfully",
                        new AgentOrderDto(savedAgentOrder.getId(), savedAgentOrder.getOrderNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateAgentOrder(AgentOrderDto agentOrderDto) {
        AgentOrder agentOrder = objectMapper.toAgentOrder(agentOrderDto);
        AgentOrder existing = agentOrderRepository.findById(agentOrder.getId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        // Keep whoever placed the order; editing it doesn't make the editor the creator.
        agentOrder.setCreatedBy(existing.getCreatedBy());
        if (agentOrderRepository.existsByOrderNumberAndIdNot(agentOrder.getOrderNumber(), agentOrder.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }

        for (AgentOrderProduct product : agentOrder.getAgentOrderProducts()) {
            product.setAgentOrder(agentOrder);
        }
        priceFromProducts(agentOrder);

        AgentOrder savedAgentOrder = agentOrderRepository.save(agentOrder);
        return ResponseEntity.ok(new StandardResponse(200, "Order Updated Successfully", new AgentOrderDto(savedAgentOrder.getId(), savedAgentOrder.getOrderNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteAgentOrder(Integer id) {
        AgentOrder agentOrder = agentOrderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("AgentOrder Not Found"));

        agentOrderRepository.delete(agentOrder);
        return new ResponseEntity<>(new StandardResponse(200, "Order Deleted Successfully", null), HttpStatus.OK);
    }

    private Agent verifiedAgent(Agent sent) {
        if (sent == null || sent.getNumber() == null || sent.getNic() == null) {
            throw new ResourceNotFoundException("Please verify your agent number and NIC before ordering.");
        }
        return agentRepository.findByNumberIgnoreCaseAndNic(sent.getNumber().trim(), sent.getNic().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No agent found with the provided Agent Number and NIC."));
    }

    /** Line totals and the grand total come from the products' agent prices, not from the browser. */
    private void priceFromProducts(AgentOrder order) {
        BigDecimal grandTotal = BigDecimal.ZERO;
        for (AgentOrderProduct line : order.getAgentOrderProducts()) {
            if (line.getQuantity() == null || line.getQuantity() <= 0) {
                throw new ResourceNotFoundException("Each product needs a quantity of at least 1.");
            }
            if (line.getProduct() == null || line.getProduct().getId() == null) {
                throw new ResourceNotFoundException("Each order line needs a product.");
            }
            Product product = productRepository.findById(line.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            BigDecimal price = product.getAgentPrice() == null ? BigDecimal.ZERO : product.getAgentPrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(line.getQuantity()));
            line.setLineTotal(lineTotal);
            grandTotal = grandTotal.add(lineTotal);
        }
        order.setGrandTotal(grandTotal);
    }
}
