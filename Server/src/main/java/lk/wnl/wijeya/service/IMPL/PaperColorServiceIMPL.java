package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperColorDto;
import lk.wnl.wijeya.repository.PaperColorRepository;
import lk.wnl.wijeya.service.PaperColorService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PaperColorServiceIMPL implements PaperColorService {
    private final PaperColorRepository paperColorRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperColorDto> getAll() {
        return objectMapper.toPaperColorDtoList(paperColorRepository.findAll());
    }
}
