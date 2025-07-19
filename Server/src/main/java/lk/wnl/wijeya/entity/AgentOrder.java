package lk.wnl.wijeya.entity;

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
@Table(name = "agent_order")
public class AgentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "order_time")
    private LocalTime orderTime;

    @Column(name = "grand_total", precision = 10, scale = 2)
    private BigDecimal grandTotal;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "agent_order_status_id", nullable = false)
    private AgentOrderStatus agentOrderStatus;

    @Size(max = 45)
    @Column(name = "order_number", length = 45)
    private String orderNumber;


    @Transient
    private String logger;

    @OneToMany(mappedBy = "agentOrder" , fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AgentOrderProduct> agentOrderProducts = new LinkedHashSet<>();



    public String getLogger() {
        return this.createdBy.getUsername();
    }
}