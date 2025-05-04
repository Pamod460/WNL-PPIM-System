package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.GenderDto;
import lk.wnl.wijeya.repository.GenderRepository;
import lk.wnl.wijeya.service.GenderService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class GenderServiceIMPL implements GenderService {
    private final GenderRepository genderRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<GenderDto> getAll() {
        return objectMapper.toGenderDtoList(genderRepository.findAll());
    }
}
