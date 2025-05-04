package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.EmployeeStatusDto;
import lk.wnl.wijeya.repository.EmployeeStatusRepository;
import lk.wnl.wijeya.service.EmployeeStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeStatusServiceIMPL implements EmployeeStatusService {
    private final EmployeeStatusRepository employeeStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<EmployeeStatusDto> getAll() {
        return objectMapper.toEmployeeStatusDtoList(employeeStatusRepository.findAll());

    }
}
