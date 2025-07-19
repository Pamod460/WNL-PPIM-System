package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperIssueDto;
import lk.wnl.wijeya.service.PaperIssueService;
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
@RequestMapping(value = "/paperissues")
@RequiredArgsConstructor
public class PaperIssueController {

    private final PaperIssueService paperIssueService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<PaperIssueDto> get() {
        return paperIssueService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<PaperIssueDto> get(@RequestParam HashMap<String, String> params) {
        return paperIssueService.getAllPaperIssues(params);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastPaperIssue() {
        return paperIssueService.getNextCode();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody PaperIssueDto PaperIssueDto) {
        return paperIssueService.savePaperIssue(PaperIssueDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody PaperIssueDto PaperIssue) {
        return paperIssueService.UpdatePaperIssue(PaperIssue);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return paperIssueService.deletePaperIssue(id);
    }

}


