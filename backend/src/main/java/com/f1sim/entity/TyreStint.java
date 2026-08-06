package com.f1sim.entity;

import com.f1sim.enums.TyreCompound;
import jakarta.persistence.*;
import lombok.*;

/**
 * One stint on a single tyre compound within a strategy plan.
 * A StrategySimulation is composed of an ordered list of stints.
 */
@Entity
@Table(name = "tyre_stints")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TyreStint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_id", nullable = false)
    private StrategySimulation simulation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TyreCompound compound;

    /** 1-based order of this stint within the strategy. */
    @Column(name = "stint_order", nullable = false)
    private Integer stintOrder;

    @Column(name = "start_lap", nullable = false)
    private Integer startLap;

    @Column(name = "end_lap", nullable = false)
    private Integer endLap;
}
