package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "cheq_payment")
public class CheqPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "cheq_status_id", nullable = false)
    private CheqStatus cheqStatus;

    @Size(max = 45)
    @Column(name = "cheq_number", length = 45)
    private String cheqNumber;

    @Column(name = "dorealized")
    private LocalDate dorealized;

    @Lob
    @Column(name = "description")
    private String description;

    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "agent_payment_id", nullable = false)
    private AgentPayment agentPayment;

}