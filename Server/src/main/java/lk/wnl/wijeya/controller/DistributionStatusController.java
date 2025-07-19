package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.AgentStatusDto;
import lk.wnl.wijeya.dto.DistributionStatusDto;
import lk.wnl.wijeya.service.AgentStatusService;
import lk.wnl.wijeya.service.DistributionStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/distributionstatuses")
@RequiredArgsConstructor
public class DistributionStatusController {

    private final DistributionStatusService distributionStatusService;

    @GetMapping(produces = "application/json")
    public List<DistributionStatusDto> get() {
        return distributionStatusService.getAllDistributionStatuses();
    }
}
