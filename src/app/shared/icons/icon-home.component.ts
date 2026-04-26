import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-home',
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
      <!-- Roof -->
      <path d="M12 3L2 12h3v9h5v-5a2 2 0 0 1 4 0v5h5v-9h3z" />
    </svg>
  `,
})
export class IconHomeComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
