package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaymentTypeDto;
import lk.wnl.wijeya.service.PaymentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/paymenttypes")
@RequiredArgsConstructor
public class PaymentTypeController {

    private final PaymentTypeService paymentTypeService;

    @GetMapping(produces = "application/json")
    public List<PaymentTypeDto> get() {
        return this.paymentTypeService.getAll();
    }
}
