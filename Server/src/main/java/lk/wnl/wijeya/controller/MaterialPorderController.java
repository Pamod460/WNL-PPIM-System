package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialPorderDto;
import lk.wnl.wijeya.service.MaterialPorderService;
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
@RequestMapping(value = "/materialporders")
@RequiredArgsConstructor
public class MaterialPorderController {

    private final MaterialPorderService materialPorderService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<MaterialPorderDto> get() {
        return materialPorderService.getAll();
    }

    @GetMapping(produces = "application/json")
    public List<MaterialPorderDto> get(@RequestParam HashMap<String, String> params,@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return materialPorderService.getAllMaterialPorders(params,authHeader);
    }


    @GetMapping(value = "/last", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastMaterialPorder() {
        return materialPorderService.getLastMaterialPONumber();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody MaterialPorderDto materialPorderDto) {
        return materialPorderService.saveMaterialPorder(materialPorderDto);
    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody MaterialPorderDto materialPorderDto) {
        return materialPorderService.UpdateMaterialPorder(materialPorderDto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return materialPorderService.deleteMaterialPorder(id);
    }

}


