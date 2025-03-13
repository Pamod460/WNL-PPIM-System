package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.dao.PrivilegeDao;
import lk.wnl.wijeya.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
    @RequestMapping(value = "/privileges")
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegedao;

    @GetMapping(produces = "application/json")
    public List<Privilege> get(@RequestParam HashMap<String, String> params) {

        List<Privilege> privileges = this.privilegedao.findAll();

        if(params.isEmpty())  return privileges;

        String roleid= params.get("roleid");
        String moduleid= params.get("moduleid");
        String operationid= params.get("operationid");

        Stream<Privilege> pstream = privileges.stream();

        if(roleid!=null) pstream = pstream.filter(p -> p.getRole().getId()==Integer.parseInt(roleid));
        if(moduleid!=null) pstream = pstream.filter(p -> p.getModule().getId()==Integer.parseInt(moduleid));
        if(operationid!=null) pstream = pstream.filter(p -> p.getOperation().getId()==Integer.parseInt(operationid));

        return pstream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Privilege privilege){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        boolean alreadyExists = privilegedao.existsByRoleAndModuleAndOperation(privilege.getRole(),privilege.getModule(),privilege.getOperation());

        if(alreadyExists){
           errors += "Privilege Already Exists";
        }

        if(errors=="")
            privilegedao.save(privilege);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(privilege.getId()));
        responce.put("url","/privileges/"+privilege.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Privilege privilege){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        boolean alreadyExists = privilegedao.existsByRoleAndModuleAndOperation(privilege.getRole(),privilege.getModule(),privilege.getOperation());

        if(alreadyExists){
            errors += "Privilege Already Exists";
        }

        if(errors=="") privilegedao.save(privilege);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(privilege.getId()));
        responce.put("url","/employees/"+privilege.getId());
        responce.put("errors",errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Privilege prv = privilegedao.findByMyId(id);

        if(prv==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") privilegedao.delete(prv);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/privileges/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


