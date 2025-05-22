package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;

public interface PaperService {
    List<PaperDto> getAllList(HashMap<String, String> params);
    List<PaperDto> getAllList();

    ResponseEntity<StandardResponse> save(PaperDto paperDto);

    ResponseEntity<StandardResponse> update(PaperDto paperDto);

    ResponseEntity<StandardResponse> detele(Integer id);
}
