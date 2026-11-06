package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductDesignDto;
import lk.wnl.wijeya.dto.ProductionOrderDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.ProductionOrderRepository;
import lk.wnl.wijeya.repository.ProductionOrderStatusRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.ProductionOrderService;
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
public class ProductionOrderServiceIMPL implements ProductionOrderService {

    private final ObjectMapper objectMapper;
    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderStatusRepository productionOrderStatusRepository;
    private final UserRepository userRepository;
    @Override
    public List<ProductionOrderDto> getAllList(HashMap<String, String> params) {
        // Implementation here
        List<ProductionOrder> productionOrders = productionOrderRepository.findAll();
        if (params.isEmpty()) return objectMapper.toProductOrdersDtoList(productionOrders);

        String orderno = params.get("orderno");
        String createddate = params.get("createddate");
        String expecteddate = params.get("expecteddate");
        String productionOrderStatus = params.get("productionOrderStatus");


        Stream<ProductionOrder> ostream = productionOrders.stream();

        if (orderno != null)
            ostream = ostream.filter(m -> m.getOrderNo().equals(orderno));
        if (createddate != null) {
            ostream = ostream.filter(m -> m.getCreatedDate().equals(LocalDate.parse(createddate)));
        }
        if (expecteddate != null)
            ostream = ostream.filter(m -> m.getExpectedDate().equals(LocalDate.parse(expecteddate)));
        if (productionOrderStatus != null) {
            ostream = ostream.filter(m -> m.getProductionOrderStatus().getId() == Integer.parseInt(productionOrderStatus));
        }

        return objectMapper.toProductOrdersDtoList(ostream.collect(Collectors.toList()));
    }

    @Override
    public List<ProductionOrderDto> getAllList() {
        List<ProductionOrder> productionOrders = productionOrderRepository.findAll();
        List<ProductionOrderDto> productionOrderDtoList = objectMapper.toProductOrdersDtoList(productionOrders);
        productionOrderDtoList = productionOrderDtoList.stream().map(
                mat -> new ProductionOrderDto(mat.getId(), mat.getOrderNo())
        ).collect(Collectors.toList());
        return productionOrderDtoList;
    }

    @Override
    public ResponseEntity<StandardResponse> save(ProductionOrderDto productionOrderDto) {
        User loggeruser = userRepository.findByUsername(productionOrderDto.getLogger());
        ProductionOrder productionOrder = objectMapper.toProductionOrder(productionOrderDto);
        productionOrder.setCreatedBy(loggeruser);
        if (productionOrderRepository.existsByOrderNo(productionOrder.getOrderNo())) {
            throw new ResourceAlreadyExistException("Order No Already Exists");
        }
        ProductionOrder savedProductionOrder = productionOrderRepository.save(productionOrder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Production Order Added Successfully", new ProductDesignDto(savedProductionOrder.getId(), savedProductionOrder.getOrderNo())));
    }

    @Override
    public ResponseEntity<StandardResponse> update(ProductionOrderDto productionOrderDto) {
        User loggeruser = userRepository.findByUsername(productionOrderDto.getLogger());
        ProductionOrder productionOrder = objectMapper.toProductionOrder(productionOrderDto);
        productionOrderRepository.findById(productionOrder.getId()).orElseThrow(() -> new ResourceNotFoundException("Production Order Not Found"));
        productionOrder.setCreatedBy(loggeruser);
        if (productionOrderRepository.existsByOrderNoAndIdNot(productionOrder.getOrderNo(), productionOrder.getId())) {
            throw new ResourceAlreadyExistException("Order No Already Exists");
        }
        ProductionOrder updatedProductionOrder = productionOrderRepository.save(productionOrder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Production Order Updated Successfully", new ProductDesignDto(updatedProductionOrder.getId(), updatedProductionOrder.getOrderNo())));
    }

    @Override
    public ResponseEntity<StandardResponse> detele(Integer id) {
        ProductionOrder productionOrder = productionOrderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Production Order Not Found"));
        productionOrderRepository.delete(productionOrder);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Production Order Deleted Successfully", null));
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode() {
        // Implementation here
        ProductionOrder lastOrder = productionOrderRepository.findTopByOrderByIdDesc();

        int nextNumber = (lastOrder != null) ? lastOrder.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode= String.format("PO-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    public void updateProductionOrderStatus(Integer paperPOrderId, Integer statusId) {

        ProductionOrder paperPorder = productionOrderRepository.findById(paperPOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper POrder not found"));

        ProductionOrderStatus status = productionOrderStatusRepository.findById(statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        paperPorder.setProductionOrderStatus(status);
        productionOrderRepository.save(paperPorder);

    }
}
