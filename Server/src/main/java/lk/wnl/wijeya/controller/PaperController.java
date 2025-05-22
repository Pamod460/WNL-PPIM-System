package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.service.PaperService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papers")
@RequiredArgsConstructor
public class PaperController {


    private final PaperService paperService;

    @GetMapping(produces = "application/json")
    public List<PaperDto> get(@RequestParam HashMap<String, String> params) {
        return paperService.getAllList(params);
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<PaperDto> get() {
        return paperService.getAllList();
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<StandardResponse> save(@RequestBody PaperDto paperDto) {
        return paperService.save(paperDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PaperDto paperDto) {
        return paperService.update(paperDto);

    }

    @DeleteMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return paperService.detele(id);

    }

}


