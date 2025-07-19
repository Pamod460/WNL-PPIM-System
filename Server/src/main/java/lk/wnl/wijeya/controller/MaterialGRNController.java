package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialGrnDto;
import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.service.MaterialGRNService;
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
@RequestMapping(value = "/materialgrns")
@RequiredArgsConstructor
public class MaterialGRNController {

    private final MaterialGRNService materialGrnService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<MaterialGrnDto> get() {
        return materialGrnService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<MaterialGrnDto> get(@RequestParam HashMap<String, String> params, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return materialGrnService.getAllMaterialGrns(params,authHeader);
    }
    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode(@RequestParam("textPart") String textPart) {
        return materialGrnService.getNextCode(textPart);
    }



    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody MaterialGrnDto materialGrnDto) {
        return materialGrnService.saveMaterialGrn(materialGrnDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody MaterialGrnDto materialGrnDto) {
        return materialGrnService.UpdateMaterialGrn(materialGrnDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return materialGrnService.deleteMaterialGrn(id);
    }

}


