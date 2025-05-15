package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "paper")
public class Paper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "paper")
    private Set<ProductPaper> productPapers = new LinkedHashSet<>();

    @Column(name = "unit_price", precision = 7, scale = 2)
    private BigDecimal unitPrice;

    @Size(max = 6)
    @Column(name = "code", length = 6)
    private String code;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "dointroduesed")
    private LocalDate dointroduesed;

    @Lob
    @Column(name = "discription")
    private String discription;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_gsm_id", nullable = false)
    private PaperGsm paperGsm;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_size_id", nullable = false)
    private PaperSize paperSize;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_type_id", nullable = false)
    private PaperType paperType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_color_id", nullable = false)
    private PaperColor paperColor;

    @OneToMany(mappedBy = "paper")
    private Set<PaperSupply> paperSupplies = new LinkedHashSet<>();

}