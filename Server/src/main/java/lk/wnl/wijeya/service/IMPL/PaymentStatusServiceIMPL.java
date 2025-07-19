package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaymentStatusDto;
import lk.wnl.wijeya.entity.PaymentStatus;
import lk.wnl.wijeya.repository.PaymentStatusRepository;
import lk.wnl.wijeya.service.PaymentStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentStatusServiceIMPL implements PaymentStatusService {

    private final ObjectMapper objectMapper;
    private final PaymentStatusRepository paymentStatusRepository;
    @Override
    public List<PaymentStatusDto> getAll() {
        List<PaymentStatus> paymentStatuses = paymentStatusRepository.findAll();
        return objectMapper.paymentStatusesToDtoList(paymentStatuses);
    }
}
