import { Component, Input } from '@angular/core';

/**
 * Clock-In icon — clock face (offset left) with an inward-pointing
 * arrow on the right side, indicating attendance check-in.
 */
@Component({
  selector: 'icon-clock-in',
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
      <!-- Clock ring (offset left, center at 9,12 r=7) -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 5a7 7 0 1 0 0 14A7 7 0 0 0 9 5zm0 1.75a5.25 5.25 0 1 1 0
           10.5A5.25 5.25 0 0 1 9 6.75z"
      />
      <!-- Clock hands (pointing to ~10:10) -->
      <path d="M9.75 8.5a.75.75 0 0 0-1.5 0v3.44L5.97 14.2a.75.75 0 1
               0 1.06 1.06l2.41-2.41A.75.75 0 0 0 9.75 12V8.5z"/>
      <!-- Entering arrow (→ from right, pointing left INTO clock) -->
      <!-- Shaft -->
      <rect x="17.5" y="11.25" width="5" height="1.5" rx="0.75"/>
      <!-- Arrowhead pointing left -->
      <path d="M17.5 9.5L15 12l2.5 2.5V9.5z"/>
    </svg>
  `,
})
export class IconClockInComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
