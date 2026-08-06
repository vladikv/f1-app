package com.f1sim.dto;

import com.f1sim.enums.TyreCompound;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** One stint as submitted by the Angular Strategy Builder. */
public record StintRequest(
        @NotNull TyreCompound compound,
        @Min(1) int startLap,
        @Min(1) int endLap
) {}
