import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { OrgLookupComponent } from '../../components/org-lookup/org-lookup.component';
import { EmailStepComponent } from '../../components/email-step/email-step.component';
import { AuthStateService } from '../../services/auth-state.service';
import { OrgThemeService } from '../../../../core/services/org-theme.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { DEMO_THEME_SLUGS } from '../../../../core/config/org-themes.const';

// ── API integration reference ──────────────────────────────────────────────
// When wiring real login:
//
//   private authService = inject(AuthService);   // core/services/auth.service.ts
//   private appState    = inject(AppStateService); // core/services/app-state.service.ts
//
//   // Replace onLoggedIn() with:
//   onLoggedIn(): void {
//     const payload: LoginRequest = {
//       email:   this.authState.email(),
//       password: this.password,        // from EmailStepComponent @Output
//       orgSlug: this.authState.orgIdentifier(),
//     };
//     this.authService.login(payload).subscribe({
//       next: () => {
//         this.loginSuccess = true;
//         setTimeout(() => this.router.navigate(['/app/dashboard']), 1400);
//       },
//       error: (err) => this.error = err.error?.message ?? 'Login failed',
//     });
//   }
// ──────────────────────────────────────────────────────────────────────────────

type LoginStep = 'org' | 'credentials';

@Component({
  selector: 'klocky-login',
  standalone: true,
  imports: [AuthShellComponent, OrgLookupComponent, EmailStepComponent],
  template: `
    <klocky-auth-shell
      [orgName]="authState.orgDisplayName()"
      [isSuccess]="loginSuccess"
    >
      @switch (step) {
        @case ('org') {
          <klocky-org-lookup (found)="step = 'credentials'" (register)="goRegister()" />
        }
        @case ('credentials') {
          <klocky-email-step (loggedIn)="onLoggedIn()" (back)="onBack()" />
        }
      }
    </klocky-auth-shell>
  `,
  styles: [':host { display: block; height: 100dvh; overflow: hidden; }'],
})
export class LoginComponent implements OnInit {
  step: LoginStep = 'org';
  loginSuccess = false;

  readonly authState = inject(AuthStateService);
  private router    = inject(Router);
  private orgTheme  = inject(OrgThemeService);
  private appState  = inject(AppStateService);

  ngOnInit(): void {
    this.orgTheme.reset();
  }

  onBack(): void {
    if (this.step === 'credentials') {
      this.authState.resetToOrgStep();
      this.orgTheme.reset();
      this.step = 'org';
    }
  }

  async onLoggedIn(): Promise<void> {
    this.loginSuccess = true;
     const randomSlug = DEMO_THEME_SLUGS[Math.floor(Math.random() * DEMO_THEME_SLUGS.length)];
    // ── Demo session — replace with real API call when backend is ready ──
    await this.appState.patch({
      accessToken:  'demo-token',
      refreshToken: 'demo-refresh',
      expiresAt:    Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      orgSlug:      this.authState.orgIdentifier() || 'demo',
      user: {
        id:        'demo-user',
        firstName: 'Demo',
        lastName:  'User',
        email:     this.authState.email() || 'demo@klocky.app',
        role:      'admin',
        orgId:     'demo-org',
        orgSlug:   this.authState.orgIdentifier() || 'demo',
        isActive:  true,
        createdAt: new Date().toISOString(),
      },
    });
    // ─────────────────────────────────────────────────────────────────────

    await this.delay(1400);
    await this.router.navigate(['/app/dashboard']); 
    this.orgTheme.apply(randomSlug);
  }

  goRegister(): void {
    this.router.navigate(['/free-trial']);
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}

