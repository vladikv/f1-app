package com.f1sim.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * A user-authored pit-stop strategy for a given race, plus the
 * Strategy Engine's computed results once simulated.
 */
@Entity
@Table(name = "strategy_simulations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StrategySimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @OneToMany(mappedBy = "simulation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TyreStint> stints = new java.util.ArrayList<>();

    /** Total predicted race time in seconds, computed by the Strategy Engine. */
    @Column(name = "predicted_total_time_seconds")
    private Double predictedTotalTimeSeconds;

    /** Difference vs the actual real-world result, once the race has finished (accuracy score). */
    @Column(name = "delta_vs_actual_seconds")
    private Double deltaVsActualSeconds;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
