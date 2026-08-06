package com.f1sim.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** Payload for POST /api/strategy/simulate */
public record StrategySimulationRequest(
        @NotNull Long raceId,
        @NotNull Long driverId,
        @NotEmpty @Valid List<StintRequest> stints
) {}
