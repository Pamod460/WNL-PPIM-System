package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.DesignationDto;
import lk.wnl.wijeya.entity.Designation;
import lk.wnl.wijeya.repository.DesignationRepository;
import lk.wnl.wijeya.service.DesignationService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DesignationServiceIMPL implements DesignationService {
    private final DesignationRepository designationRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DesignationDto> getAllDesignations() {
        List<Designation> designations = this.designationRepository.findAll();

        return objectMapper.toDesignationDtoList(designations);
    }
}
