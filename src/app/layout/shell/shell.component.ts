import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { UiToastContainerComponent, UiModalOutletComponent, OrgRegisterModalComponent } from '../../shared/components';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'klocky-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, UiToastContainerComponent, UiModalOutletComponent, OrgRegisterModalComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private _routerSub?: Subscription;

  // Joint-venture branding — set orgName (and optionally orgLogoUrl + orgAccentColor) to activate JV mode.
  // Leave empty for default Klocky-only branding.
  orgName = 'TEST Company';
  orgLogoUrl = '';
  orgAccentColor = '#28dcaf';  // e.g. '#10b981' for green

  constructor(private router: Router) {}

  ngOnInit() {
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