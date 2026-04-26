import { Component, Input } from '@angular/core';

/**
 * Clock-Out icon — clock face (offset left) with an outward-pointing
 * arrow on the right side, indicating attendance check-out.
 */
@Component({
  selector: 'icon-clock-out',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      [attr.fill]="color"
      aria-hidden="true"
    >
      <!-- Clock ring (same offset as clock-in) -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 5a7 7 0 1 0 0 14A7 7 0 0 0 9 5zm0 1.75a5.25 5.25 0 1 1 0
           10.5A5.25 5.25 0 0 1 9 6.75z"
      />
      <!-- Clock hands -->
      <path d="M9.75 8.5a.75.75 0 0 0-1.5 0v3.44L5.97 14.2a.75.75 0 1
               0 1.06 1.06l2.41-2.41A.75.75 0 0 0 9.75 12V8.5z"/>
      <!-- Exiting arrow (→ pointing right, leaving clock) -->
      <!-- Shaft -->
      <rect x="15.5" y="11.25" width="5" height="1.5" rx="0.75"/>
      <!-- Arrowhead pointing right -->
      <path d="M20.5 9.5L23 12l-2.5 2.5V9.5z"/>
    </svg>
  `,
})
export class IconClockOutComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
