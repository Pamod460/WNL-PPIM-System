package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperGsmDto;
import lk.wnl.wijeya.repository.PaperGsmRepository;
import lk.wnl.wijeya.service.PaperGsmService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PaperGsmServiceIMPL implements PaperGsmService {
    private final PaperGsmRepository paperGsmRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperGsmDto> getAll() {
        return objectMapper.toPaperGsmDtoList(paperGsmRepository.findAll());
    }
}
