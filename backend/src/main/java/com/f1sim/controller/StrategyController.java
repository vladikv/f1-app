package com.f1sim.controller;

import com.f1sim.dto.StrategySimulationRequest;
import com.f1sim.dto.StrategySimulationResponse;
import com.f1sim.entity.User;
import com.f1sim.service.StrategySimulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/strategy")
@RequiredArgsConstructor
@Tag(name = "Strategy", description = "Pit-stop strategy simulation endpoints")
public class StrategyController {

    private final StrategySimulationService simulationService;

    @PostMapping("/simulate")
    @Operation(summary = "Simulate a proposed pit-stop strategy and return predicted race time")
    public StrategySimulationResponse simulate(
            @Valid @RequestBody StrategySimulationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return simulationService.simulate(request, currentUser);
    }
}
