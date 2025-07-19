package lk.wnl.wijeya.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @Column(name = "map")
    private byte[] map;

    @Column(name = "distance")
    private Integer distance;

    @Column(name = "estimated_time")
    private Double estimatedTime;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;


    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @JsonIgnore
    @OneToMany(mappedBy = "route")
    private Set<Agent> agents = new LinkedHashSet<>();
    @Transient
    private String logger;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "route_status_id", nullable = false)
    private RouteStatus routeStatus;

    @Size(max = 6)
    @Column(name = "route_number", length = 6)
    private String routeNumber;

    public String getLogger() {
        return this.createdBy.getUsername();
    }


}