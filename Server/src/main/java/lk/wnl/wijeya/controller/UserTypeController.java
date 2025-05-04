package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.repository.UsrtypeRepository;
import lk.wnl.wijeya.entity.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/usrtypes")
public class UserTypeController {

    @Autowired
    private UsrtypeRepository usrtypeRepository;

    @GetMapping(path ="/list", produces = "application/json")
    public List<UserType> get() {

        List<UserType> usrtypes = this.usrtypeRepository.findAll();

        usrtypes = usrtypes.stream().map(
                usrtype -> { UserType d = new UserType();
                    d.setId(usrtype.getId());
                    d.setName(usrtype.getName());
                    return d; }
        ).collect(Collectors.toList());

        return usrtypes;

    }

}


