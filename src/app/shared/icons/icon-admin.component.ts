import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-admin',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  `,
  styles: [':host { display: inline-flex; align-items: center; }'],
})
export class IconAdminComponent {
  @Input() size: number | string = 18;
}
