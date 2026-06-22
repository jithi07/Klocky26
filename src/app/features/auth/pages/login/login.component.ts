import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { OrgLookupComponent } from '../../components/org-lookup/org-lookup.component';
import { EmailStepComponent } from '../../components/email-step/email-step.component';
import { AuthStateService } from '../../services/auth-state.service';
import { OrgThemeService } from '../../../../core/services/org-theme.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { UserAuthService } from '../../../../core/services/user-auth.service';
import { RealtimeService } from '../../../../core/services/realtime.service';
import { UiModalComponent } from '../../../../shared/components/ui-modal/ui-modal.component';
import { UiInputComponent } from '../../../../shared/components/ui-input/ui-input.component';

type LoginStep = 'org' | 'credentials' | 'loading';

@Component({
  selector: 'klocky-login',
  standalone: true,
  imports: [AuthShellComponent, OrgLookupComponent, EmailStepComponent, ReactiveFormsModule, UiModalComponent, UiInputComponent],
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
        @case ('loading') {
          <div class="login-loading">
            <div class="login-loading-spinner"></div>
            <h2 class="login-loading-title">Welcome back!</h2>
            <p class="login-loading-text">Setting up your workspace...</p>
          </div>
        }
      }
    </klocky-auth-shell>

    <!-- Non-dismissible: the temp/old password was just exposed in plaintext, close the window now. -->
    <ui-modal [open]="mustChangePassword()" [closeOnBackdrop]="false" title="Set a new password">
      <form [formGroup]="changePasswordForm" (ngSubmit)="submitChangePassword()">
        <ui-input
          label="Current password" type="password" [required]="true"
          formControlName="currentPassword"
        />
        <ui-input
          label="New password" type="password" [required]="true" hint="At least 8 characters"
          formControlName="newPassword"
        />
        @if (changePasswordError()) {
          <p class="login-loading-text" style="color:#ef4444; margin-top: 8px;">{{ changePasswordError() }}</p>
        }
        <button class="lk-btn" type="submit" style="margin-top: 16px; width: 100%;" [disabled]="changingPassword()">
          {{ changingPassword() ? 'Saving…' : 'Save & continue' }}
        </button>
      </form>
    </ui-modal>
  `,
  styles: [`
    :host { display: block; height: 100dvh; overflow: hidden; }

    .login-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      padding: 40px 20px;
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .login-loading-spinner {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-loading-title {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .login-loading-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  `],
})
export class LoginComponent implements OnInit {
  step: LoginStep = 'org';
  loginSuccess = false;

  readonly mustChangePassword = signal(false);
  readonly changingPassword = signal(false);
  readonly changePasswordError = signal('');
  changePasswordForm: FormGroup;

  readonly authState = inject(AuthStateService);
  private router    = inject(Router);
  private orgTheme  = inject(OrgThemeService);
  private appState  = inject(AppStateService);
  private userAuth  = inject(UserAuthService);
  private realtime  = inject(RealtimeService);
  private fb        = inject(FormBuilder);

  private orgSlugForNav = '';

  constructor() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.orgTheme.reset();
  }

  onBack(): void {
    if (this.step === 'credentials' || this.step === 'loading') {
      this.authState.resetToOrgStep();
      this.orgTheme.reset();
      this.step = 'org';
    }
  }

  onLoggedIn(): void {
    this.step = 'loading';
    this.orgSlugForNav = this.appState.orgSlug() || this.authState.orgIdentifier();

    this.userAuth.getMe().subscribe({
      next: (res) => {
        if (res.data.accentColor) {
          this.orgTheme.apply(this.orgTheme.generateThemeFromColor(res.data.accentColor));
        }
        this.realtime.connect();

        if (res.data.mustChangePassword) {
          this.mustChangePassword.set(true);
          return;
        }
        this.finishLogin();
      },
      error: () => {
        // /me failed even though login succeeded — fall back to the credentials step
        this.step = 'credentials';
      },
    });
  }

  submitChangePassword(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.invalid || this.changingPassword()) return;
    this.changePasswordError.set('');
    this.changingPassword.set(true);

    this.userAuth.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.mustChangePassword.set(false);
        this.finishLogin();
      },
      error: (err) => {
        this.changingPassword.set(false);
        this.changePasswordError.set(err?.error?.message ?? 'Could not change password. Please try again.');
      },
    });
  }

  private async finishLogin(): Promise<void> {
    this.loginSuccess = true;
    await this.delay(600);
    await this.router.navigate([`/${this.orgSlugForNav}/app/dashboard`]);
  }

  goRegister(): void {
    this.router.navigate(['/free-trial']);
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
