package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.AgentOrderDto;
import lk.wnl.wijeya.entity.AgentOrder;
import lk.wnl.wijeya.entity.AgentOrderProduct;
import lk.wnl.wijeya.entity.Distribution;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.AgentOrderRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.AgentOrderService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AgentOrderServiceIMPL implements AgentOrderService {
    private final AgentOrderRepository agentOrderRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

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
        for (AgentOrderProduct product : agentOrder.getAgentOrderProducts()) {
            product.setAgentOrder(agentOrder);
        }

        AgentOrder savedAgentOrder = agentOrderRepository.save(agentOrder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse(HttpStatus.CREATED.value(), "Order Added Successfully",
                        new AgentOrderDto(savedAgentOrder.getId(), savedAgentOrder.getOrderNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateAgentOrder(AgentOrderDto agentOrderDto) {
        AgentOrder agentOrder = objectMapper.toAgentOrder(agentOrderDto);
        agentOrderRepository.findById(agentOrder.getId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        agentOrder.setCreatedBy(userRepository.findByUsername(agentOrderDto.getLogger()));
        if (agentOrderRepository.existsByOrderNumberAndIdNot(agentOrder.getOrderNumber(), agentOrder.getId())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }

        for (AgentOrderProduct product : agentOrder.getAgentOrderProducts()) {
            product.setAgentOrder(agentOrder);
        }

        AgentOrder savedAgentOrder = agentOrderRepository.save(agentOrder);
        return ResponseEntity.ok(new StandardResponse(200, "Order Updated Successfully", new AgentOrderDto(savedAgentOrder.getId(), savedAgentOrder.getOrderNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteAgentOrder(Integer id) {
        AgentOrder agentOrder = agentOrderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("AgentOrder Not Found"));

        agentOrderRepository.delete(agentOrder);
        return new ResponseEntity<>(new StandardResponse(200, "Order Deleted Successfully", null), HttpStatus.OK);
    }
}
