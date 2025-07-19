package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "paper_grn")
public class PaperGrn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "grand_total", precision = 10, scale = 2)
    private BigDecimal grandTotal;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "time")
    private LocalTime time;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_porder_id", nullable = false)
    private PaperPorder paperPorder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "paper_grn_status_id", nullable = false)
    private PaperGrnStatus paperGrnStatus;

    @OneToMany(mappedBy = "paperGrn", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PaperGrnPaper> paperGrnPapers = new LinkedHashSet<>();

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;
    @Transient
    private String logger;

    public String getLogger() {
        return createdBy.getUsername();
    }


}