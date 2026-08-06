import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyApiService } from '../../core/services/strategy-api.service';
import { Stint, StrategySimulationResponse, TyreCompound } from '../../core/models/strategy.model';

@Component({
  // `standalone: true` means this component declares its own dependencies
  // (via `imports`) instead of belonging to an NgModule. Modern Angular
  // (17+) defaults to this — no more app.module.ts bloat.
  selector: 'app-strategy-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategy-builder.component.html',
  styleUrl: './strategy-builder.component.scss'
})
export class StrategyBuilderComponent {

  // `input()` is the new signal-based input API (Angular 17.1+),
  // replacing @Input(). raceId/driverId/totalLaps are passed in
  // from the parent route (e.g. the race detail page).
  raceId = input.required<number>();
  driverId = input.required<number>();
  totalLaps = input.required<number>();

  private readonly api = inject(StrategyApiService);

  // A `signal` is a reactive, mutable value container — reading it
  // (via `stints()`) inside a template or computed() automatically
  // subscribes to future changes. Unlike RxJS, no manual subscribe/
  // unsubscribe is needed and Angular's change detection uses it
  // directly for fine-grained updates (zoneless-ready).
  readonly stints = signal<Stint[]>([
    { compound: 'MEDIUM', startLap: 1, endLap: 20 }
  ]);

  readonly compounds: TyreCompound[] = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'];

  readonly result = signal<StrategySimulationResponse | null>(null);
  readonly isSimulating = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // `computed()` derives a value from other signals and re-evaluates
  // lazily, only when one of its dependencies (here, `stints`) changes.
  // This replaces manually recalculating "covered laps" on every edit.
  readonly lapsCovered = computed(() => {
    const list = this.stints();
    return list.length === 0 ? 0 : list[list.length - 1].endLap;
  });

  readonly isStrategyValid = computed(() => this.lapsCovered() === this.totalLaps());

  addStint(): void {
    const current = this.stints();
    const lastEndLap = current.length > 0 ? current[current.length - 1].endLap : 0;

    // `.update()` takes the previous value and returns the new one —
    // the recommended way to derive a new array/object immutably,
    // instead of mutating the existing array in place.
    this.stints.update(list => [
      ...list,
      { compound: 'HARD', startLap: lastEndLap + 1, endLap: Math.min(lastEndLap + 15, this.totalLaps()) }
    ]);
  }

  removeStint(index: number): void {
    this.stints.update(list => list.filter((_, i) => i !== index));
  }

  updateStint(index: number, patch: Partial<Stint>): void {
    this.stints.update(list =>
      list.map((stint, i) => (i === index ? { ...stint, ...patch } : stint))
    );
  }

  runSimulation(): void {
    if (!this.isStrategyValid()) {
      this.errorMessage.set(`Stints must cover exactly ${this.totalLaps()} laps (currently ${this.lapsCovered()}).`);
      return;
    }

    this.isSimulating.set(true);
    this.errorMessage.set(null);

    this.api.simulate({
      raceId: this.raceId(),
      driverId: this.driverId(),
      stints: this.stints()
    }).subscribe({
      next: (response) => {
        this.result.set(response);
        this.isSimulating.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Simulation failed: ' + (err.error?.message ?? 'unknown error'));
        this.isSimulating.set(false);
      }
    });
  }
}
