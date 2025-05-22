package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperColorDto;
import lk.wnl.wijeya.dto.PaperSizeDto;
import lk.wnl.wijeya.repository.PaperColorRepository;
import lk.wnl.wijeya.repository.PaperSizeRepository;
import lk.wnl.wijeya.service.PaperSizeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor

public class PaperSizeServiceIMPL implements PaperSizeService {
    private final PaperSizeRepository paperSizeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<PaperSizeDto> getAll() {
        return objectMapper.toPaperSizeDtoList(paperSizeRepository.findAll());
    }

}
