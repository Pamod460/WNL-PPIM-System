package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.MaterialIssueDto;
import lk.wnl.wijeya.entity.MaterialIssue;
import lk.wnl.wijeya.service.MaterialIssueService;
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
@RequestMapping(value = "/materialissues")
@RequiredArgsConstructor
public class MaterialIssueController {

    private final MaterialIssueService materialIssueService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<MaterialIssueDto> get() {
        return materialIssueService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<MaterialIssueDto> get(@RequestParam HashMap<String, String> params) {
        return materialIssueService.getAllMaterialIssues(params);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode() {
        return materialIssueService.getNextCode();
    }

    @PreAuthorize("hasAuthority('material issue-insert')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody MaterialIssueDto MaterialIssueDto) {
        return materialIssueService.saveMaterialIssue(MaterialIssueDto);
    }

    @PreAuthorize("hasAuthority('material issue-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody MaterialIssueDto MaterialIssue) {
        return materialIssueService.UpdateMaterialIssue(MaterialIssue);

    }

    @PreAuthorize("hasAuthority('material issue-delete')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return materialIssueService.deleteMaterialIssue(id);
    }

}


