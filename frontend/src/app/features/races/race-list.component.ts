import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CircuitTrackComponent } from '../../shared/components/circuit-track/circuit-track.component';
import { CIRCUIT_TRACKS } from '../../core/data/circuit-tracks.data';

// FIA minimum race distance: 305km for most circuits, 260km for Monaco
// (its street-circuit layout makes the standard minimum impractical).
const STANDARD_RACE_DISTANCE_M = 305_000;
const MONACO_RACE_DISTANCE_M = 260_000;

// Rough average pace used only for the hero's decorative time estimate —
// not the real Strategy Engine calculation (that happens in the actual
// builder against a user-authored stint plan). ~19s per km of lap length
// approximates modern F1 race pace across a mix of circuit types, plus
// a flat allowance for two pit stops.
const PACE_SECONDS_PER_KM = 19;
const PIT_STOP_ALLOWANCE_SECONDS = 2 * 23;

@Component({
  selector: 'app-race-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CircuitTrackComponent],
  templateUrl: './race-list.component.html',
  styleUrl: './race-list.component.scss'
})
export class RaceListComponent {
  readonly availableTracks = CIRCUIT_TRACKS;
  readonly selectedTrackId = signal(
      CIRCUIT_TRACKS.find(t => t.id === 'mc-1929')?.id ?? CIRCUIT_TRACKS[0].id
  );

  readonly selectedTrack = computed(() =>
      this.availableTracks.find(t => t.id === this.selectedTrackId())!
  );

  // Everything below re-derives automatically whenever selectedTrackId
  // changes — no manual event wiring needed beyond the <select> binding.
  readonly estimatedLaps = computed(() => {
    const track = this.selectedTrack();
    if (!track.lengthM) return null;
    const raceDistance = track.id === 'mc-1929' ? MONACO_RACE_DISTANCE_M : STANDARD_RACE_DISTANCE_M;
    return Math.round(raceDistance / track.lengthM);
  });

  readonly estimatedTotalTime = computed(() => {
    const track = this.selectedTrack();
    const laps = this.estimatedLaps();
    if (!laps || !track.lengthM) return null;

    const lapTimeSeconds = (track.lengthM / 1000) * PACE_SECONDS_PER_KM;
    const totalSeconds = lapTimeSeconds * laps + PIT_STOP_ALLOWANCE_SECONDS;
    return this.formatRaceTime(totalSeconds);
  });

  private formatRaceTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}