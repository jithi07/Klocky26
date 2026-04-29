import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IconHomeComponent,
  IconEmployeesComponent,
  IconClockComponent,
  IconSettingsComponent,
  IconLogoutComponent,
  IconPaletteComponent,
  IconKlockyLogoComponent,
  IconUserComponent,
} from '../../shared/icons';
import { OrgThemeService } from '../../core/services/org-theme.service';

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
    IconUserComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = false;

  private router    = inject(Router);
  private orgTheme  = inject(OrgThemeService);

  logout(): void {
    this.orgTheme.reset();
    this.router.navigate(['/']);
  }

  /** Organisation name — triggers joint-venture mode when set */
  @Input() orgName = '';
  /** Organisation logo URL — shown in JV brand area */
  @Input() orgLogoUrl = '';
  /** Brand accent hex color — changes sidebar accent in JV mode e.g. '#10b981' */
  @Input() orgAccentColor = '';

  get isJv(): boolean {
    return !!(this.orgName || this.orgLogoUrl);
  }

  /** Resolved accent — always uses the org/app accent, falling back to default teal */
  get accentColor(): string {
    return this.orgAccentColor || '#0d9488';
  }
}
