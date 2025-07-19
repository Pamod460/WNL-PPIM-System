package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperPorderDto;
import lk.wnl.wijeya.service.PaperPorderService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/paperporders")
@RequiredArgsConstructor
public class PaperPorderController {

    private final PaperPorderService paperPorderService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<PaperPorderDto> get() {
        return paperPorderService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<PaperPorderDto> get(@RequestParam HashMap<String, String> params,@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return paperPorderService.getAllPaperPorders(params,authHeader);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextNumber(@RequestParam("textPart") String textPart) {
        return paperPorderService.getNextCode(textPart);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody PaperPorderDto paperPorderDto) {
        return paperPorderService.savePaperPorder(paperPorderDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PaperPorderDto paperPorderDto) {
        return paperPorderService.UpdatePaperPorder(paperPorderDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return paperPorderService.deletePaperPorder(id);
    }

}


