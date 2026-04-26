import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-employees',
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
      <!-- Front person head -->
      <circle cx="9" cy="7" r="3" />
      <!-- Front person body -->
      <path d="M9 13c-3.87 0-7 1.57-7 3.5V19h14v-2.5c0-1.93-3.13-3.5-7-3.5z" />
      <!-- Back person head -->
      <circle cx="17" cy="7" r="3" opacity="0.6" />
      <!-- Back person body -->
      <path d="M17 13c-.55 0-1.08.06-1.59.16C16.96 14.03 18 15.18 18 16.5V19h6v-2.5C24 14.57 20.87 13 17 13z" opacity="0.6" />
    </svg>
  `,
})
export class IconEmployeesComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
