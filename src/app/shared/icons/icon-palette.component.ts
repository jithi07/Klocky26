import { Component, Input } from '@angular/core';

/** Palette / UI Kit icon */
@Component({
  selector: 'icon-palette',
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
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10
               a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.2-.64-1.67
               a.25.25 0 0 1 .19-.43H16c3.31 0 6-2.69 6-6
               C22 6.48 17.52 2 12 2z
               M6.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z
               M9.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z
               M14.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z
               M17.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  `,
})
export class IconPaletteComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
