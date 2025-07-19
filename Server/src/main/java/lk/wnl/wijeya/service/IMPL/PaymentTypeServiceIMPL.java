package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaymentTypeDto;
import lk.wnl.wijeya.entity.PaymentType;
import lk.wnl.wijeya.repository.PaymentTypeRepository;
import lk.wnl.wijeya.service.PaymentTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentTypeServiceIMPL implements PaymentTypeService {

    private final ObjectMapper objectMapper;
    private final PaymentTypeRepository paymentTypeRepository;
    @Override
    public List<PaymentTypeDto> getAll() {
        List<PaymentType> paymentTypes = paymentTypeRepository.findAll();
        return objectMapper.paymentTypesToDtoList(paymentTypes);
    }
}
