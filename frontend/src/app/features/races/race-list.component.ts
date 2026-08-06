import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TyreSceneComponent } from '../../shared/components/tyre-scene/tyre-scene.component';
import { StrategyRingComponent } from '../../shared/components/strategy-ring/strategy-ring.component';
import { Stint } from '../../core/models/strategy.model';

@Component({
  selector: 'app-race-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TyreSceneComponent, StrategyRingComponent],
  templateUrl: './race-list.component.html',
  styleUrl: './race-list.component.scss'
})
export class RaceListComponent {
  // Sample strategy used only to give the hero's signature ring
  // something real to draw on first paint — actual race data will
  // replace this once the races list is wired to the backend.
  readonly sampleStints: Stint[] = [
    { compound: 'MEDIUM', startLap: 1, endLap: 18 },
    { compound: 'HARD', startLap: 19, endLap: 42 },
    { compound: 'SOFT', startLap: 43, endLap: 58 }
  ];
  readonly sampleTotalLaps = 58;
}