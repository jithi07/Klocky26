import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'klocky-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  readonly sidebarOpen = signal(true);

  constructor(private router: Router) {}

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }

  logout(): void { this.router.navigate(['/klocky-admin']); }
}
