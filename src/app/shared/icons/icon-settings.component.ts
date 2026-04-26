import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-settings',
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
      <!-- Gear outer body + center hole using even-odd rule -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z
           M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96a6.5 6.5 0 0 0-1.62-.94l-.36-2.54a.49.49 0 0 0-.48-.41h-3.84a.49.49 0 0 0-.47.41l-.36 2.54a6.5 6.5 0 0 0-1.63.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.49.49 0 0 0 .12.61l2.03 1.58A6.3 6.3 0 0 0 4.8 12c0 .31.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.63.94l.36 2.54c.05.24.24.41.47.41h3.84c.24 0 .44-.17.48-.41l.36-2.54a6.5 6.5 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58z"
      />
    </svg>
  `,
})
export class IconSettingsComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
