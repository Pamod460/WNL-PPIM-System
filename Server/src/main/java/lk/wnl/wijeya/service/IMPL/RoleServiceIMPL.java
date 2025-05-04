package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.RoleDto;
import lk.wnl.wijeya.repository.RoleRepository;
import lk.wnl.wijeya.service.RoleService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceIMPL implements RoleService {
private final RoleRepository roleRepository;
private final ObjectMapper objectMapper;
    @Override
    public List<RoleDto> getAll() {
        return objectMapper.toRoleDtoList(roleRepository.findAll());
    }
}
