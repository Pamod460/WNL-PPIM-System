package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.service.PaperService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/papers")
@RequiredArgsConstructor
public class PaperController {

    private final PaperService paperService;

    @GetMapping(produces = "application/json")
    public List<PaperDto> getAll(@RequestParam HashMap<String, String> params) {
        return paperService.getAllList(params);
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<PaperDto> getAllList() {
        return paperService.getAllList();
    }
    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode(@RequestParam("textPart") String textPart) {
        return paperService.getNextCode(textPart);
    }

    @PreAuthorize("hasAuthority('paper-insert')")
    @PostMapping(produces = "application/json")
    public ResponseEntity<StandardResponse> save(@RequestBody PaperDto paperDto) {
        System.out.println(paperDto.getDoIntroduced());
        return paperService.save(paperDto);
    }

    @PreAuthorize("hasAuthority('paper-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PaperDto paperDto) {
        System.out.println(paperDto.getDoIntroduced());
        return paperService.update(paperDto);

    }

    @PreAuthorize("hasAuthority('paper-delete')")
    @DeleteMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return paperService.detele(id);
    }

}


