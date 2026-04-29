import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { UiToastContainerComponent, UiModalOutletComponent } from '../../shared/components';
import { Subscription, filter } from 'rxjs';
import { OrgThemeService } from '../../core/services/org-theme.service';

@Component({
  selector: 'klocky-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, UiToastContainerComponent, UiModalOutletComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private _routerSub?: Subscription;

  // Joint-venture branding — populated when an org is active.
  orgName = '';
  orgLogoUrl = '';

  get orgAccentColor(): string {
    return this.orgTheme.current.accent;
  }

  constructor(private router: Router, private orgTheme: OrgThemeService) {}

  ngOnInit() {
    // Restore org theme from previous session so accent/colors are correct on reload
    this.orgTheme.restoreFromStorage();

    this._routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.isSidebarOpen = false; });
  }

  ngOnDestroy() {
    this._routerSub?.unsubscribe();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}