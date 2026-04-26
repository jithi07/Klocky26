import { Component, Input } from '@angular/core';

/** Hamburger / menu icon — three horizontal bars. */
@Component({
  selector: 'icon-menu',
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
      <rect x="3" y="5"  width="18" height="2" rx="1" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
      <rect x="3" y="17" width="18" height="2" rx="1" />
    </svg>
  `,
})
export class IconMenuComponent {
  @Input() color = 'currentColor';
  @Input() size: number | string = 20;
}
