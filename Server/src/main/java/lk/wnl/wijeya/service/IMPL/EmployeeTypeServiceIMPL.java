package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.EmployeeTypeDto;
import lk.wnl.wijeya.repository.EmployeeTypeRepository;
import lk.wnl.wijeya.service.EmployeeTypeService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class EmployeeTypeServiceIMPL implements EmployeeTypeService {
    private final EmployeeTypeRepository employeeTypeRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<EmployeeTypeDto> getAll() {
       return  objectMapper.toEmployeeTypeDtoList(employeeTypeRepository.findAll());
    }
}
