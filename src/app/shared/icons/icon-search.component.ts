import { Component, Input } from '@angular/core';

/** Search / magnifying-glass icon. */
@Component({
  selector: 'icon-search',
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
      <!-- Circle -->
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.5 3a7.5 7.5 0 1 0 4.55 13.47l4.24 4.24a1 1 0 0 0 1.42-1.42
           l-4.24-4.24A7.5 7.5 0 0 0 10.5 3zm-5.5 7.5a5.5 5.5 0 1 1 11 0
           5.5 5.5 0 0 1-11 0z"
      />
    </svg>
  `,
})
export class IconSearchComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
