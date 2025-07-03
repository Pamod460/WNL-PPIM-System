package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.RouteStatusDto;
import lk.wnl.wijeya.service.RouteStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/route-statuses")
@RequiredArgsConstructor
public class RouteStatusController {

    private final RouteStatusService routeStatusService;

    @GetMapping(path = "/list", produces = "application/json")
    public List<RouteStatusDto> get() {
        return routeStatusService.getAll();
    }




}


