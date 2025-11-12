package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.entity.Paper;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.PaperRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.PaperService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PaperServiceIMPL implements PaperService {
    private final PaperRepository paperRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Override
    public List<PaperDto> getAllList(HashMap<String, String> params) {
        List<Paper> papers = paperRepository.findAll();
        if (params.isEmpty()) return objectMapper.toPaperDtoList(papers);

        String code = params.get("code");
        String name = params.get("name");
        String paperstatusid = params.get("paperstatusid");
        String paperTypeid = params.get("paperTypeid");


        Stream<Paper> mstream = papers.stream();

        if (paperTypeid != null)
            mstream = mstream.filter(m -> m.getPaperType().getId() == Integer.parseInt(paperTypeid));
        if (paperstatusid != null)
            mstream = mstream.filter(m -> m.getPaperStatus().getId() == Integer.parseInt(paperstatusid));
        if (code != null) mstream = mstream.filter(m -> m.getCode().equals(code));
        if (name != null) mstream = mstream.filter(m -> m.getName().contains(name));

        return objectMapper.toPaperDtoList(mstream.collect(Collectors.toList()));
    }

    @Override
    public List<PaperDto> getAllList() {
        List<Paper> papers = paperRepository.findAll();
        List<PaperDto> papersList = objectMapper.toPaperDtoList(papers);
        papersList = papersList.stream().map(
                mat -> new PaperDto(mat.getId(), mat.getName(), mat.getUnitPrice())
        ).collect(Collectors.toList());
        return papersList;
    }

    @Override
    public ResponseEntity<StandardResponse> save(PaperDto paperDto) {
        User loggeruser = userRepository.findByUsername(paperDto.getLogger());
        Paper paper = objectMapper.toPaper(paperDto);
        paper.setCreatedBy(loggeruser);
        if (paperRepository.existsByCode(paper.getCode())) {
            throw new ResourceAlreadyExistException("Paper Already Exists");
        }
        Paper savedpaper = paperRepository.save(paper);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Paper Added Successfully", new PaperDto(savedpaper.getId(), savedpaper.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> update(PaperDto paperDto) {
        Paper paper = objectMapper.toPaper(paperDto);
        Paper extpaper = paperRepository.findById(paper.getId()).orElseThrow(() -> new ResourceNotFoundException("Paper Not Found"));
        paper.setCreatedBy(extpaper.getCreatedBy());
        if (!extpaper.getCode().equals(paper.getCode()) && paperRepository.existsByCode(paper.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }
        Paper mat = this.paperRepository.save(paper);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Paper Updated Successfully",
                        new PaperDto(mat.getId(), mat.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> detele(Integer id) {
        Paper paper = paperRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paper Not Found"));
        paperRepository.delete(paper);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Paper Deleted Successfully", null));
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        Paper lastPaper = paperRepository.findTopByCodeStartingWithOrderByCodeDesc(textPart);

        int nextNumber = 1;
        if (lastPaper != null && lastPaper.getCode().length() > textPart.length()) {
            try {
                String numberPart = lastPaper.getCode().substring(textPart.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }

        String nextCode = textPart.toUpperCase() + String.format("%03d", nextNumber); // e.g., WP0001

        Map<String, String> result = new HashMap<>();
        result.put("code", nextCode);
        return ResponseEntity.ok(result);
    }

    @Override
    @Transactional
    public void increaseQuantity(Integer id, BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Quantity must be a non-negative value");
        }

        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper not found with ID: " + id));

        BigDecimal newQuantity = paper.getQoh().add(quantity);
        if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResourceNotFoundException("Quantity cannot be negative");
        }

        paper.setQoh(newQuantity);
        paperRepository.save(paper);
    }
    @Override
    @Transactional
    public void decreaseQuantity(Integer id, BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResourceNotFoundException("Quantity must be a non-negative value");
        }

        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper not found with ID: " + id));

        BigDecimal newQuantity = paper.getQoh().subtract(quantity);
        if (newQuantity.compareTo(paper.getRop()) < 0) {
            throw new ResourceNotFoundException("Cannot be Issue Requested Quantity the reorder point is: " + paper.getRop());
        }

        paper.setQoh(newQuantity);
        paperRepository.save(paper);
    }
}
