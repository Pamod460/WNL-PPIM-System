package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface RouteService {

    List<RouteDto> getAll();
    ResponseEntity<StandardResponse> save(RouteDto routeDto);
    ResponseEntity<StandardResponse> Update(RouteDto routeDto);
    ResponseEntity<StandardResponse> delete(Integer id);
    ResponseEntity<Map<String, String>> getLastRouteCode(String name);
}
