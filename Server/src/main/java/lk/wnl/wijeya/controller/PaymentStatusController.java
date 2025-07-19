package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaymentStatusDto;
import lk.wnl.wijeya.service.PaymentStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/paymentstatuses")
@RequiredArgsConstructor
public class PaymentStatusController {

    private final PaymentStatusService paymentStatusService;

    @GetMapping(produces = "application/json")
    public List<PaymentStatusDto> get() {
        return this.paymentStatusService.getAll();
    }
}
