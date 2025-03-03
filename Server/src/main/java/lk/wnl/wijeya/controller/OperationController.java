package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dao.OperationDao;
import lk.wnl.wijeya.entity.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/operations")
public class OperationController {

    @Autowired
    private OperationDao operationDao;

    @GetMapping(produces = "application/json")
    public List<Operation> get(@RequestParam HashMap<String, String> params) {

        List<Operation> operations = this.operationDao.findAll();

        if(params.isEmpty())  return operations;

        String moduleid= params.get("moduleid");

        Stream<Operation> pstream = operations.stream();

        return pstream.collect(Collectors.toList());

    }
}


