package com.f1sim.dto;

/** Result returned to the frontend after simulating a strategy. */
public record StrategySimulationResponse(
        Long simulationId,
        double predictedTotalTimeSeconds,
        String formattedTotalTime,
        Double deltaVsActualSeconds
) {}
