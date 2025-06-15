package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentDto;
import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.dto.RouteStatusDto;
import lk.wnl.wijeya.service.RouteService;
import lk.wnl.wijeya.service.RouteStatusService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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


