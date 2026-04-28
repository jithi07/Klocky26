import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'klocky-auth-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lk-page">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="lk-grid"></div>

      <div class="lk-card" [class.is-success]="isSuccess">
        <!-- Brand -->
        <div class="lk-brand">
          <div class="lk-logo-mark">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#lg-shell)"/>
              <path d="M10 8v16M10 16l8-8M10 16l8 8" stroke="#fff" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="lg-shell" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6366f1"/><stop offset="1" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          @if (orgName) {
            <span class="lk-logo-name lk-logo-org">{{ orgName }}<span class="lk-logo-tld">.klock</span></span>
          } @else {
            <span class="lk-logo-name">klock</span>
          }
        </div>

        <!-- Projected content -->
        <ng-content />
      </div>

      <p class="lk-footer">© 2026 Klock · Secure login</p>
    </div>
  `,
  styleUrl: './auth-shell.component.scss',
})
export class AuthShellComponent {
  @Input() orgName = '';
  @Input() isSuccess = false;
}
