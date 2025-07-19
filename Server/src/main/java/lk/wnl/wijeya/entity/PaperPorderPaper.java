package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "paper_porder_paper")
public class PaperPorderPaper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "quentity")
    private Integer quentity;

    @Column(name = "expected_line_cost", precision = 7, scale = 2)
    private BigDecimal expectedLineCost;
    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_porder_id", nullable = false)
    private PaperPorder paperPorder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_id", nullable = false)
    private Paper paper;

}