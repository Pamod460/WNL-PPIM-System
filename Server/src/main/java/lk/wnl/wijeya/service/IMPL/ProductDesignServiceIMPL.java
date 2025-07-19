package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductDesignDto;
import lk.wnl.wijeya.entity.ProductDesign;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.ProductDesignRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.ProductDesignService;
import lk.wnl.wijeya.util.StandardResponse;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductDesignServiceIMPL implements ProductDesignService {

    private final ObjectMapper objectMapper;
    private final ProductDesignRepository productDesignRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProductDesignDto> getAllList(HashMap<String, String> params) {
        // Implementation here
        List<ProductDesign> productDesigns = productDesignRepository.findAll();
        if (params.isEmpty()) return objectMapper.toProductDesignsDtoList(productDesigns);

        String product = params.get("product");
        String name = params.get("name");
        String productDesignStatus = params.get("productDesignStatus");
        String date = params.get("date");


        Stream<ProductDesign> mstream = productDesigns.stream();

        if (product != null)
            mstream = mstream.filter(m -> m.getProduct().getId() == Integer.parseInt(product));
        if (name != null)
            mstream = mstream.filter(m -> m.getName().equals(name));
        if (productDesignStatus != null)
            mstream = mstream.filter(m -> m.getProductDesignStatus().getId() == Integer.parseInt(productDesignStatus));
        if (date != null) {
            LocalDateTime parsedDate = LocalDateTime.parse(date);
            mstream = mstream.filter(m -> m.getDate().equals(parsedDate));
        }

        return objectMapper.toProductDesignsDtoList(mstream.collect(Collectors.toList()));
    }

    @Override
    public List<ProductDesignDto> getAllList() {
        List<ProductDesign> productDesigns = productDesignRepository.findAll();
        List<ProductDesignDto> productDesignDtoList = objectMapper.toProductDesignsDtoList(productDesigns);
        productDesignDtoList = productDesignDtoList.stream().map(
                mat -> new ProductDesignDto(mat.getId(),mat.getProduct(), mat.getName())
        ).collect(Collectors.toList());
        return productDesignDtoList;
    }

    @Override
    public ResponseEntity<StandardResponse> save(ProductDesignDto productDesignDto) {
        User loggeruser = userRepository.findByUsername(productDesignDto.getLogger());
        ProductDesign productDesign = objectMapper.toProductDesign(productDesignDto);
        productDesign.setCreatedBy(loggeruser);
        if (productDesignRepository.existsByName(productDesign.getName())) {
            throw new ResourceAlreadyExistException("Name Already Exists");
        }
        ProductDesign savedProductDesign = productDesignRepository.save(productDesign);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardResponse("Product Design Added Successfully", new ProductDesignDto(savedProductDesign.getId(), savedProductDesign.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> update(ProductDesignDto productDesignDto) {
        User loggeruser = userRepository.findByUsername(productDesignDto.getLogger());
        ProductDesign productDesign = objectMapper.toProductDesign(productDesignDto);
        productDesignRepository.findById(productDesign.getId()).orElseThrow(() -> new ResourceNotFoundException("Product Design Not Found"));
        productDesign.setCreatedBy(loggeruser);
        if (productDesignRepository.existsByNameAndIdNot(productDesign.getName(), productDesign.getId())) {
            throw new ResourceAlreadyExistException("Name Already Exists");
        }
        ProductDesign updatedProductDesign = productDesignRepository.save(productDesign);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse("Product Design Updated Successfully", new ProductDesignDto(updatedProductDesign.getId(), updatedProductDesign.getName())));
    }

    @Override
    public ResponseEntity<StandardResponse> detele(Integer id) {
        ProductDesign productDesign = productDesignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product Design Not Found"));
        productDesignRepository.delete(productDesign);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new StandardResponse(HttpStatus.OK.value(),"Product Design Deleted Successfully", null));
    }

    @Override
    public ResponseEntity<Map<String, String>> getNextCode(String textPart) {
        // Implementation here
        return null;
    }

}
