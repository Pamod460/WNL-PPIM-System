package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.BankDto;
import lk.wnl.wijeya.entity.Bank;
import lk.wnl.wijeya.repository.BankRepository;
import lk.wnl.wijeya.service.BankService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankServiceIMPL implements BankService {

    private final ObjectMapper objectMapper;
    private final BankRepository bankRepository;
    @Override
    public List<BankDto> getAllBanks() {
        List<Bank> bankList = bankRepository.findAll();
        return objectMapper.toBankDtoList(bankList);
    }
}
