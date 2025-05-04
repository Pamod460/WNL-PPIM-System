package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.UserStatusDto;
import lk.wnl.wijeya.repository.UsrtypeRepository;
import lk.wnl.wijeya.service.UserStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserStatusServiceIMPL implements UserStatusService {
    private final UsrtypeRepository usrtypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<UserStatusDto> getAll() {
        return objectMapper.toUserStatusDtoList(usrtypeRepository.findAll());
    }
}
