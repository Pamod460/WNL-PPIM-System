package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
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
    public List<MaterialPorderDto> get(@RequestParam HashMap<String, String> params,
                                       @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return materialPorderService.getAllMaterialPorders(params,authHeader);
    }


    @GetMapping(value = "/next", produces = "application/json")
    public ResponseEntity<Map<String, String>> getNextCode(@RequestParam("textPart") String textPart) {
        return materialPorderService.getNextCode(textPart);
    }

    @PreAuthorize("hasAuthority('material porder-insert')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody MaterialPorderDto materialPorderDto) {
        return materialPorderService.saveMaterialPorder(materialPorderDto);
    }

    @PreAuthorize("hasAuthority('material porder-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody MaterialPorderDto materialPorderDto) {
        return materialPorderService.UpdateMaterialPorder(materialPorderDto);

    }

    @PreAuthorize("hasAuthority('material porder-delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return materialPorderService.deleteMaterialPorder(id);
    }

}


