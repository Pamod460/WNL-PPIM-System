package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.service.AgentService;
import lk.wnl.wijeya.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<RouteDto> get() {
        return routeService.getAll();
    }

}


