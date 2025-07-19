package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.DistributionDto;
import lk.wnl.wijeya.util.StandardResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface DistributionService {

    List<DistributionDto> getAllList();

    List<DistributionDto> getAllDistributions(HashMap<String, String> params);

    ResponseEntity<Map<String, String>> getNextCode();

    ResponseEntity<StandardResponse> saveDistribution(DistributionDto distributionDto);

    ResponseEntity<StandardResponse> UpdateDistribution(DistributionDto distributionDto);

    ResponseEntity<StandardResponse> deleteDistribution(Integer id);


}
