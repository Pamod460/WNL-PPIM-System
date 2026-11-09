package lk.wnl.wijeya.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.service.RouteService;
import lk.wnl.wijeya.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping( produces = "application/json")
    public List<RouteDto> getAll() {
        return routeService.getAll();
    }

    @GetMapping(value = "/nextcode/{name}", produces = "application/json")
    public ResponseEntity<Map<String, String>> getLastRoute(@PathVariable String name) {
        return routeService.getLastRouteCode(name);
    }

    @PreAuthorize("hasAuthority('route-insert')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> add(@RequestBody RouteDto agentDto) {
        return routeService.save(agentDto);
    }

    @PreAuthorize("hasAuthority('route-update')")
    @PutMapping
    public ResponseEntity<StandardResponse> update(@RequestBody RouteDto agent) {
        return routeService.Update(agent);

    }

    @PreAuthorize("hasAuthority('route-delete')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id) {
        return routeService.delete(id);
    }


}


