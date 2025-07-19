package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.BankDto;
import lk.wnl.wijeya.dto.CheqStatusDto;
import lk.wnl.wijeya.service.BankService;
import lk.wnl.wijeya.service.CheqStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/banks")
@RequiredArgsConstructor
public class BankController {

    private final BankService bankService;

    @GetMapping(produces = "application/json")
    public List<BankDto> get() {
        return bankService.getAllBanks();
    }
}
