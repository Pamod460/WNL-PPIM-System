package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.CheqStatusDto;
import lk.wnl.wijeya.entity.CheqStatus;
import lk.wnl.wijeya.repository.CheqStatusRepository;
import lk.wnl.wijeya.service.CheqStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CheqStatusServiceIMPL implements CheqStatusService {

    private final ObjectMapper objectMapper;
    private final CheqStatusRepository cheqStatusRepository;
    @Override
    public List<CheqStatusDto> getAllCheqStatuses() {
        List<CheqStatus> cheqStatusList = cheqStatusRepository.findAll();
        return objectMapper.toCheqStatusDtoList(cheqStatusList);
    }
}
