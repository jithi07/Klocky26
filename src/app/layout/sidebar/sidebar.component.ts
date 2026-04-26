import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IconHomeComponent,
  IconEmployeesComponent,
  IconClockComponent,
  IconSettingsComponent,
  IconLogoutComponent,
  IconPaletteComponent,
  IconKlockyLogoComponent,
} from '../../shared/icons';

@Component({
  selector: 'klocky-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    IconHomeComponent,
    IconEmployeesComponent,
    IconClockComponent,
    IconSettingsComponent,
    IconLogoutComponent,
    IconPaletteComponent,
    IconKlockyLogoComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = false;

  /** Organisation name — triggers joint-venture mode when set */
  @Input() orgName = '';
  /** Organisation logo URL — shown in JV brand area */
  @Input() orgLogoUrl = '';
  /** Brand accent hex color — changes sidebar accent in JV mode e.g. '#10b981' */
  @Input() orgAccentColor = '';

  get isJv(): boolean {
    return !!(this.orgName || this.orgLogoUrl);
  }

  /** Resolved accent color: org override or Klocky indigo */
  get accentColor(): string {
    return this.isJv && this.orgAccentColor ? this.orgAccentColor : '#6366f1';
  }
}
