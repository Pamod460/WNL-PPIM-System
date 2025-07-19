package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperGrnDto;
import lk.wnl.wijeya.service.PaperGRNService;
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
@RequestMapping(value = "/papergrns")
@RequiredArgsConstructor
public class PaperGRNController {

    private final PaperGRNService paperGrnService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<PaperGrnDto> get() {
        return paperGrnService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<PaperGrnDto> get(@RequestParam HashMap<String, String> params, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return paperGrnService.getAllPaperGrns(params, authHeader);
    }

    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode(@RequestParam("textPart") String textPart) {
        return paperGrnService.getNextCode(textPart);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody PaperGrnDto paperGrnDto) {
        return paperGrnService.savePaperGrn(paperGrnDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PaperGrnDto paperGrnDto) {
        return paperGrnService.UpdatePaperGrn(paperGrnDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return paperGrnService.deletePaperGrn(id);
    }

}


