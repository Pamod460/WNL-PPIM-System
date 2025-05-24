package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.DistrictDto;
import lk.wnl.wijeya.dto.RouteDto;
import lk.wnl.wijeya.entity.District;
import lk.wnl.wijeya.entity.Route;
import lk.wnl.wijeya.repository.DistrictRepository;
import lk.wnl.wijeya.repository.RouteRepository;
import lk.wnl.wijeya.service.RouteService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceIMPL implements RouteService {
    private final RouteRepository routeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<RouteDto> getAll() {
        List<Route> routeList = routeRepository.findAll();
        return objectMapper.toRouteDtoList(routeList);
    }
}
