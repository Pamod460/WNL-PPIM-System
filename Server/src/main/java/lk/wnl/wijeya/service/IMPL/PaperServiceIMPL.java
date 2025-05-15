package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.repository.PaperRepository;
import lk.wnl.wijeya.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaperServiceIMPL implements PaperService {
    private final PaperRepository paperRepository;

    @Override
    public List<PaperDto> getAllList() {

        return paperRepository.findAll().stream().map(paper -> PaperDto.builder()
                .id(paper.getId())
                .name(paper.getName()).unitprice(paper.getUnitprice())
                .build()).collect(Collectors.toList());
    }
}
