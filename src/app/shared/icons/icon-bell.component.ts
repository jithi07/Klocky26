import { Component, Input } from '@angular/core';

/** Notification bell icon — clean filled bell with clapper. */
@Component({
  selector: 'icon-bell',
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
      <!-- Bell dome + shelf platform -->
      <path d="M18 16v-5c0-3.07-2.13-5.64-5-6.32V4c0-.83-.67-1.5-1.5-1.5
               S10 3.17 10 4v.68C7.13 5.36 5 7.93 5 11v5l-2 2v1h18v-1l-2-2z"/>
      <!-- Clapper / vibration dot -->
      <path d="M12 23c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/>
    </svg>
  `,
})
export class IconBellComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
