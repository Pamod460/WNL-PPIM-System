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
@Table(name = "distribution")
public class Distribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "distribution_number", length = 45)
    private String distributionNumber;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "distribution_status_id", nullable = false)
    private DistributionStatus distributionStatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "agent_order_id", nullable = false)
    private AgentOrder agentOrder;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "time")
    private LocalTime time;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "grand_total", precision = 7, scale = 2)
    private BigDecimal grandTotal;


    @OneToMany(mappedBy = "distribution", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DistributionProduct> distributionProducts = new LinkedHashSet<>();

    @Lob
    @Column(name = "description")
    private String description;
    @Transient
    private String logger;
    @JsonIgnore
    @OneToMany(mappedBy = "distribution")
    private Set<AgentPayment> agentPayments = new LinkedHashSet<>();

    public String getLogger() {
        return this.createdBy.getUsername();
    }

}