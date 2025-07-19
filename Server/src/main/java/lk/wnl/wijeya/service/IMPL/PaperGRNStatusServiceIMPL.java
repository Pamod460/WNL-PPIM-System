package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.PaperGrnStatusDto;
import lk.wnl.wijeya.repository.PaperGRNStatusRepository;
import lk.wnl.wijeya.service.PaperGRNStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class PaperGRNStatusServiceIMPL implements PaperGRNStatusService {
    private final PaperGRNStatusRepository paperGRNStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<PaperGrnStatusDto> getAll() {
        return objectMapper.toPaperGrnStatusDtoList(paperGRNStatusRepository.findAll());
    }
}

