import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-clock',
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
      <!-- Clock outer ring (filled circle - background ring via even-odd) -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
      />
      <!-- Hour hand -->
      <path d="M12.75 7a.75.75 0 0 0-1.5 0v5.25L8.47 15.03a.75.75 0 1 0 1.06 1.06l3-3A.75.75 0 0 0 12.75 13V7z" />
      <!-- 12 o'clock tick -->
      <rect x="11.25" y="3.5" width="1.5" height="2" rx="0.75" />
      <!-- 3 o'clock tick -->
      <rect x="18.5" y="11.25" width="2" height="1.5" rx="0.75" />
      <!-- 6 o'clock tick -->
      <rect x="11.25" y="18.5" width="1.5" height="2" rx="0.75" />
      <!-- 9 o'clock tick -->
      <rect x="3.5" y="11.25" width="2" height="1.5" rx="0.75" />
    </svg>
  `,
})
export class IconClockComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
