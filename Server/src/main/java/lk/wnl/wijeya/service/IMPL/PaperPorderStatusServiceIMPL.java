package lk.wnl.wijeya.service.IMPL;


import lk.wnl.wijeya.dto.PaperPorderStatusDto;
import lk.wnl.wijeya.repository.PaperPorderStatusRepository;
import lk.wnl.wijeya.service.PaperPorderStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaperPorderStatusServiceIMPL implements PaperPorderStatusService {
private final PaperPorderStatusRepository paperPorderStatusRepository;
private final ObjectMapper objectMapper;
    @Override
    public List<PaperPorderStatusDto> getAll() {
        return objectMapper.toPaperPoderStatusDtoList(paperPorderStatusRepository.findAll());
    }
}

