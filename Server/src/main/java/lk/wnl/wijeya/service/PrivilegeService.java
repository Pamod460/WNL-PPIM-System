package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PrivilegeDto;
import lk.wnl.wijeya.entity.Privilege;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;

public interface PrivilegeService {
    List<Privilege> getAll(HashMap<String, String> params);

    ResponseEntity<StandardResponse> save(PrivilegeDto privilege);

    ResponseEntity<StandardResponse> update(PrivilegeDto privilegeDto);

    ResponseEntity<StandardResponse> delete(Integer id);
}
