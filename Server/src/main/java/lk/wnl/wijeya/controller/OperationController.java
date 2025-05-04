package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dto.OperationDto;
import lk.wnl.wijeya.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/operations")
@RequiredArgsConstructor
public class OperationController {

    private final OperationService operationService;


    @GetMapping(produces = "application/json")
    public List<OperationDto> get() {

        return operationService.getAll();


    }
}


