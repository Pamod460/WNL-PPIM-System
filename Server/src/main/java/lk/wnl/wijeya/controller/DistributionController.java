package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.DistributionDto;
import lk.wnl.wijeya.service.DistributionService;
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
@RequestMapping(value = "/distributions")
@RequiredArgsConstructor
public class DistributionController {

    private final DistributionService distributionService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<DistributionDto> get() {
        return distributionService.getAllList();
    }

    @GetMapping(produces = "application/json")
    public List<DistributionDto> get(@RequestParam HashMap<String, String> params) {
        return distributionService.getAllDistributions(params);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode() {
        return distributionService.getNextCode();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody DistributionDto distributionDto) {
        return distributionService.saveDistribution(distributionDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody DistributionDto distributionDto) {
        return distributionService.UpdateDistribution(distributionDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return distributionService.deleteDistribution(id);
    }

}



