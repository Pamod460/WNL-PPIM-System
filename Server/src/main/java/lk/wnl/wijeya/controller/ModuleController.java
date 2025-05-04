package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dto.ModuleDto;
import lk.wnl.wijeya.repository.ModuleRepository;
import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/modules")
@RequiredArgsConstructor
public class ModuleController {
    private final ModuleService moduleService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<ModuleDto> get() {
       return moduleService.getAll();


    }

}


