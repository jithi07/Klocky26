import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrialEmailStepComponent } from '../../components/trial-email-step/trial-email-step.component';
import { CompanySetupComponent } from '../../components/company-setup/company-setup.component';
import { OtpStepComponent } from '../../../auth/components/otp-step/otp-step.component';
import { AuthShellComponent } from '../../../auth/components/auth-shell/auth-shell.component';
import { AuthStateService } from '../../../auth/services/auth-state.service';

export type TrialStep = 'email' | 'otp' | 'setup';

@Component({
  selector: 'ob-free-trial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TrialEmailStepComponent, OtpStepComponent, AuthShellComponent, CompanySetupComponent],
  templateUrl: './free-trial.component.html',
  styleUrl: './free-trial.component.scss',
})
export class FreeTrialComponent {
  private router = inject(Router);
  private authState = inject(AuthStateService);

  step       = signal<TrialStep>('email');
  adminEmail = signal('');

  onEmailSubmitted(email: string): void {
    this.adminEmail.set(email);
    this.authState.setEmail(email);
    this.step.set('otp');
  }

  onOtpVerified(): void {
    setTimeout(() => this.step.set('setup'), 7200);
  }

  onSetupComplete(): void {
    this.router.navigate(['/app/dashboard']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
