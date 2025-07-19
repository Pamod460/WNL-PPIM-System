package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Product;
import lk.wnl.wijeya.entity.ProductDesign;
import lk.wnl.wijeya.entity.User;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductDesignDto {
    private Integer id;
    private ProductDto product;
    private String name;
    private String description;
    private byte[] designDocument;
    private byte[] images;
    private ProductDesignStatusDto productDesignStatus;
    private LocalDateTime date;
    private String logger;

    public ProductDesignDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public ProductDesignDto(Integer id, ProductDto product, String name) {
        this.id = id;
        this.product = product;
        this.name = name;
    }
}