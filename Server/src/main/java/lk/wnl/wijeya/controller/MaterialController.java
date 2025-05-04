package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.MaterialDto;
import lk.wnl.wijeya.service.MaterialService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/materials")
@RequiredArgsConstructor
public class MaterialController {


private final MaterialService materialService;
    @GetMapping(produces = "application/json")
    public List<MaterialDto> get(@RequestParam HashMap<String, String> params) {
       return materialService.getAllList(params);
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<MaterialDto> get() {

       return materialService.getAllList();



    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<StandardResponse> save(@RequestBody MaterialDto materialDto) {
   return      materialService.save(materialDto);

    }

    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody MaterialDto materialDto) {
        return materialService.update(materialDto);

    }

    @DeleteMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return  materialService.detele(id);

    }

}


