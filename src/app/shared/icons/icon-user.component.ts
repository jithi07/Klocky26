import { Component, Input } from '@angular/core';

/** Profile / avatar icon — circular frame with head + shoulders silhouette. */
@Component({
  selector: 'icon-user',
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
      <!-- Circular frame (donut via evenodd) -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
           10-4.48 10-10S17.52 2 12 2zm0 1.8a8.2 8.2 0 1 1 0 16.4
           A8.2 8.2 0 0 1 12 3.8z"
      />
      <!-- Head -->
      <circle cx="12" cy="9.5" r="3"/>
      <!-- Shoulders -->
      <path d="M6 19c0-2.76 2.69-5 6-5s6 2.24 6 5H6z"/>
    </svg>
  `,
})
export class IconUserComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
