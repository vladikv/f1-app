package com.f1sim.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    /** Average pit crew stop time in seconds — feeds into strategy loss calculations. */
    @Column(name = "avg_pit_stop_seconds")
    private Double avgPitStopSeconds;

    @OneToMany(mappedBy = "team")
    @Builder.Default
    private List<Driver> drivers = new java.util.ArrayList<>();
}
