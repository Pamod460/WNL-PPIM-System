package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.Route;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.repository.RouteRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.RouteService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RouteServiceIMPL implements RouteService {
    private final RouteRepository routeRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<RouteDto> getAll() {
        List<Route> routeList = routeRepository.findAll();
        return objectMapper.toRouteDtoList(routeList);
    }

    @Override
    public ResponseEntity<StandardResponse> save(RouteDto routeDto) {
        User logger = userRepository.findByUsername(routeDto.getLogger());
        Route route = objectMapper.toRoute(routeDto);
        route.setCreatedBy(logger);

        if (routeRepository.existsByRouteNumber(routeDto.getRouteNumber())) {
            throw new ResourceAlreadyExistException("Route number already exists: " + routeDto.getRouteNumber());
        }
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(new StandardResponse(200, "Route saved successfully", new RouteDto(savedRoute.getId(), savedRoute.getRouteNumber(), savedRoute.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> Update(RouteDto route) {
        return routeRepository.findById(route.getId())
                .map(existingRoute -> {
                    Route updatedRoute = objectMapper.toRoute(route);
                    updatedRoute.setCreatedBy(existingRoute.getCreatedBy());
                    updatedRoute.setId(existingRoute.getId());
                    routeRepository.save(updatedRoute);
                    return ResponseEntity.ok(new StandardResponse(200, "Route updated successfully", null));
                })
                .orElse(ResponseEntity.status(404).body(new StandardResponse(404, "Route not found", null)));
    }

    @Override
    public ResponseEntity<StandardResponse> delete(Integer id) {
        return routeRepository.findById(id)
                .map(route -> {
                    routeRepository.delete(route);
                    return ResponseEntity.ok(new StandardResponse(200, "Route deleted successfully", null));
                })
                .orElse(ResponseEntity.status(404).body(new StandardResponse(404, "Route not found", null)));
    }

    @Override
    public ResponseEntity<Map<String, String>> getLastRouteCode(String name) {
        name = name.toUpperCase();
        String code;
        Route route = routeRepository.findTopByOrderByIdDesc();

        int no = (route != null) ? route.getId() + 1 : 1;

        if (no < 10) {
            code = name+"00" + no;
        } else if (no < 100) {
            code = name+"0" + no;
        } else {
            code = name + no;
        }

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }
}
