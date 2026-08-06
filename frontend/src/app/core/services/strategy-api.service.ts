import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  StrategySimulationRequest,
  StrategySimulationResponse
} from '../models/strategy.model';

// providedIn: 'root' registers this service as a singleton in the
// application's root injector — one instance is shared everywhere,
// no need to list it in a module's `providers` array.
@Injectable({ providedIn: 'root' })
export class StrategyApiService {

  // `inject()` is the functional alternative to constructor injection.
  // It works outside constructors too (e.g. in route guards, resolvers),
  // and here it just keeps the class body a bit leaner.
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/strategy';

  /**
   * Sends a proposed strategy to the backend and returns an Observable
   * of the simulation result. The actual HTTP call only fires once
   * something subscribes to this Observable (cold observable) —
   * typically the component does that via the async pipe.
   */
  simulate(request: StrategySimulationRequest): Observable<StrategySimulationResponse> {
    return this.http.post<StrategySimulationResponse>(`${this.baseUrl}/simulate`, request);
  }
}
