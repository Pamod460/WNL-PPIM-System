package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.DistributionDto;
import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.DistributionRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.DistributionService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DistributionServiceIMPL implements DistributionService {

    private final ObjectMapper objectMapper;
    private final DistributionRepository distributionRepository;
    private final UserRepository userRepository;
    @Override
    public List<DistributionDto> getAllList() {
        List<Distribution> distributionList = distributionRepository.findAll();
        List<DistributionDto> distributionDtoList = objectMapper.toDistributionDtoList(distributionList);
        distributionDtoList = distributionDtoList.stream().map(
                dis -> new DistributionDto(dis.getId(), dis.getDistributionNumber())
        ).collect(Collectors.toList());
        return distributionDtoList;
    }

    @Override
    public List<DistributionDto> getAllDistributions(HashMap<String, String> params) {
        List<Distribution> distributionList = this.distributionRepository.findAll();

            if (params.isEmpty()) return objectMapper.toDistributionDtoList(distributionList);

            Stream<Distribution> stream = distributionList.stream();

            String agentOrder = params.get("agentOrder");
            String date = params.get("date");
            String distributionStatus = params.get("distributionStatus");

            if (agentOrder != null) stream = stream.filter(a -> a.getAgentOrder().getOrderNumber().equals(agentOrder));
            if (date != null) stream = stream.filter(a -> a.getDate().equals(LocalDate.parse(date)));
            if (distributionStatus != null) stream = stream.filter(a -> a.getDistributionStatus().getId() == Integer.parseInt(distributionStatus));

            return objectMapper.toDistributionDtoList(stream.collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode() {
        Distribution distribution = distributionRepository.findTopByOrderByIdDesc();

        int nextNumber = (distribution != null) ? distribution.getId() + 1 : 1;

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String nextCode= String.format("D-%s-%04d", datePart, nextNumber);

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<StandardResponse> saveDistribution(DistributionDto distributionDto) {
        User loggeruser = userRepository.findByUsername(distributionDto.getLogger());
        Distribution distribution = objectMapper.toDistributionList(distributionDto);
        distribution.setCreatedBy(loggeruser);
        if (distributionRepository.existsByDistributionNumber(distribution.getDistributionNumber())) {
            throw new ResourceAlreadyExistException("Distribution Already Exists");
        }

        for (DistributionProduct distributionProduct : distribution.getDistributionProducts()) {
            distributionProduct.setDistribution(distribution);
        }
        Distribution savedDistribution = distributionRepository.save(distribution);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Paper Added Successfully", new PaperDto(savedDistribution.getId(), savedDistribution.getDistributionNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> UpdateDistribution(DistributionDto distributionDto) {
     Distribution existingdistribution =   distributionRepository.findById(distributionDto.getId()).orElseThrow(() -> new ResourceNotFoundException("Distribution Not Found"));
        Distribution distribution = objectMapper.toDistributionList(distributionDto);
        distribution.setCreatedBy(existingdistribution.getCreatedBy());
        if (distributionRepository.existsByDistributionNumberAndIdNot(distribution.getDistributionNumber(), distribution.getId())) {
            throw new ResourceAlreadyExistException("Distribution Already Exists");
        }

        for (DistributionProduct distributionProduct : distribution.getDistributionProducts()) {
            distributionProduct.setDistribution(distribution);
        }
        Distribution savedDistribution = distributionRepository.save(distribution);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Distribution Updated Successfully", new PaperDto(savedDistribution.getId(), savedDistribution.getDistributionNumber())));
    }

    @Override
    public ResponseEntity<StandardResponse> deleteDistribution(Integer id) {
        Distribution distribution = distributionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Distribution Not Found"));
        distributionRepository.delete(distribution);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Paper Deleted Successfully", null));
    }


}
