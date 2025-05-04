package lk.wnl.wijeya.controller;


import lk.wnl.wijeya.repository.UsestatusRepository;
import lk.wnl.wijeya.entity.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/userstatuses")
public class UserStatusController {

    @Autowired
    private UsestatusRepository usestatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<UserStatus> get() {

        List<UserStatus> userStatuses = this.usestatusdao.findAll();

        userStatuses = userStatuses.stream().map(
                userStatus -> { UserStatus d = new UserStatus();
                    d.setId(userStatus.getId());
                    d.setName(userStatus.getName());
                    return d; }
        ).collect(Collectors.toList());

        return userStatuses;

    }

}


