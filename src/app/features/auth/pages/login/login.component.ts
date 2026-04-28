import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { OrgLookupComponent } from '../../components/org-lookup/org-lookup.component';
import { EmailStepComponent } from '../../components/email-step/email-step.component';
import { OtpStepComponent } from '../../components/otp-step/otp-step.component';
import { AuthStateService } from '../../services/auth-state.service';

type LoginStep = 'org' | 'email' | 'otp';

@Component({
  selector: 'klocky-login',
  standalone: true,
  imports: [AuthShellComponent, OrgLookupComponent, EmailStepComponent, OtpStepComponent],
  template: `
    <klocky-auth-shell
      [orgName]="authState.orgDisplayName()"
      [isSuccess]="step === 'otp' && otpSuccess"
    >
      @switch (step) {
        @case ('org') {
          <klocky-org-lookup (found)="step = 'email'" (register)="goRegister()" />
        }
        @case ('email') {
          <klocky-email-step (otpSent)="step = 'otp'" (back)="onBack()" />
        }
        @case ('otp') {
          <klocky-otp-step
            [orgName]="authState.orgDisplayName()"
            (verified)="onVerified()"
            (back)="onBack()"
          />
        }
      }
    </klocky-auth-shell>
  `,
  styles: [':host { display: block; height: 100dvh; overflow: hidden; }'],
})
export class LoginComponent {
  step: LoginStep = 'org';
  otpSuccess = false;

  readonly authState = inject(AuthStateService);
  private router = inject(Router);

  onBack(): void {
    if (this.step === 'otp') {
      this.step = 'email';
    } else if (this.step === 'email') {
      this.authState.resetToOrgStep();
      this.step = 'org';
    }
  }

  async onVerified(): Promise<void> {
    this.otpSuccess = true;
    await this.delay(1400);
    this.router.navigate(['/app/dashboard']);
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}

