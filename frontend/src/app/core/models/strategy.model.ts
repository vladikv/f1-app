// These types mirror the backend DTOs (StintRequest, StrategySimulationRequest,
// StrategySimulationResponse) 1-to-1, so the compiler catches mismatches
// with the API contract at build time instead of at runtime.

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export interface Stint {
  compound: TyreCompound;
  startLap: number;
  endLap: number;
}

export interface StrategySimulationRequest {
  raceId: number;
  driverId: number;
  stints: Stint[];
}

export interface StrategySimulationResponse {
  simulationId: number;
  predictedTotalTimeSeconds: number;
  formattedTotalTime: string;
  deltaVsActualSeconds: number | null;
}
