package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.ProductDto;
import lk.wnl.wijeya.entity.Product;
import lk.wnl.wijeya.entity.ProductMaterial;
import lk.wnl.wijeya.entity.ProductPaper;
import lk.wnl.wijeya.entity.User;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.ProductRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.ProductService;
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
public class ProductServiceIMPL implements ProductService {
    private final ObjectMapper objectMapper;
    private final ProductRepository productRepository;
private final UserRepository userRepository;
    @Override
    public List<ProductDto> getAllList() {

        return objectMapper.toProductDtoList(productRepository.findAll());
    }

    @Override
    public ResponseEntity<StandardResponse> save(ProductDto productDto) {
        User loggeruser = userRepository.findByUsername(productDto.getLogger());
        if (productRepository.existsByCode(productDto.getCode())) {
            throw new ResourceAlreadyExistException("Product already exists");
        }
        Product product = objectMapper.toProduct(productDto);
        product.setCreatedBy(loggeruser);

        for (ProductMaterial p : product.getProductMaterials()) p.setProduct(product);
        for (ProductPaper p : product.getProductPapers()) p.setProduct(product);

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(new StandardResponse(200, "Successfully Saved", savedProduct.getId()));
    }

    @Override
    public ResponseEntity<StandardResponse> update(ProductDto productDto) {
        Product existingProduct = productRepository.findById(productDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (productRepository.existsByCodeAndIdNot(productDto.getCode(), productDto.getId())) {
            throw new ResourceAlreadyExistException("Product already exists");
        }

        existingProduct.getProductPapers().clear();
        existingProduct.getProductMaterials().clear();

        Product product = objectMapper.toProduct(productDto);
        product.setCreatedBy(existingProduct.getCreatedBy());

        for (ProductMaterial p : product.getProductMaterials()) p.setProduct(product);
        for (ProductPaper p : product.getProductPapers()) p.setProduct(product);

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(new StandardResponse(200, "Successfully Updated", savedProduct.getId()));
    }

    @Override
    public ResponseEntity<StandardResponse> delete(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        productRepository.delete(product);
        return ResponseEntity.ok(new StandardResponse(200, "Successfully Deleted", id));
    }

    @Override
    public ResponseEntity<Map<String, String>> getLastProduct() {
        String code;
        Product product = productRepository.findTopByOrderByIdDesc();

        int no = (product != null) ? Integer.parseInt(product.getCode().substring(1)) + 1 : 1;

        if (no < 10) {
            code = "P00" + no;
        } else if (no < 100) {
            code = "P0" + no;
        } else {
            code = "P" + no;
        }

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }

    @Override
    public List<ProductDto> getAll(HashMap<String, String> params) {
        return objectMapper.toProductDtoList(productRepository.findAll());
    }
}
