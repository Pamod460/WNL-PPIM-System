package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.RouteStatusDto;
import lk.wnl.wijeya.repository.RouteStatusRepository;
import lk.wnl.wijeya.service.RouteStatusService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteStatusServiceIMPL implements RouteStatusService {

    private final RouteStatusRepository routeStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<RouteStatusDto> getAll() {
        return objectMapper.toRouteStatusDto(routeStatusRepository.findAll());
    }
}
