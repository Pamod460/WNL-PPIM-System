package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;

public interface MaterialService {
    List<MaterialDto> getAllList(HashMap<String, String> params);
    List<MaterialDto> getAllList();

    ResponseEntity<StandardResponse> save(MaterialDto materialDto);

    ResponseEntity<StandardResponse> update(MaterialDto materialDto);

    ResponseEntity<StandardResponse> detele(Integer id);
}
