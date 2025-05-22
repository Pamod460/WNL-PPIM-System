package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperStatusDto;
import lk.wnl.wijeya.repository.PaperStatusRepository;
import lk.wnl.wijeya.service.PaperStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PaperStatusServiceIMPL implements PaperStatusService {
    private final PaperStatusRepository paperStatusRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperStatusDto> getAll() {
        return objectMapper.toPaperStatusDtoList(paperStatusRepository.findAll());
    }
}
