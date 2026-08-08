import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircuitTrackData } from '../../../core/models/circuit-track.model';

/**
 * Renders a track outline split into 3 colored sectors (matching
 * FIA timing-tower convention), numbered corner markers, and a
 * glowing dot that continuously animates around the lap using
 * native SVG <animateMotion> + <mpath> — no JS animation loop needed,
 * the browser's SVG engine drives it.
 */
@Component({
    selector: 'app-circuit-track',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './circuit-track.component.html',
    styleUrl: './circuit-track.component.scss'
})
export class CircuitTrackComponent {
    track = input.required<CircuitTrackData>();

    // A unique id per instance so multiple maps on one page don't
    // collide on the <mpath href="#lapPath-...">reference.
    readonly pathId = `lap-path-${Math.random().toString(36).slice(2, 9)}`;
}