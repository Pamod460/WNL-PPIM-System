package lk.wnl.wijeya.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "paper_issue")
public class PaperIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "production_order_id", nullable = false)
    private ProductionOrder productionOrder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "paperIssue",fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<IssuedPaper> issuedPapers = new LinkedHashSet<>();

    @Transient
    private String logger;

    @Column(name = "issued_time")
    private LocalTime issuedTime;

    public String getLogger() {
        return this.createdBy.getUsername();
    }

}