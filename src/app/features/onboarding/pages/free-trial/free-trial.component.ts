import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrialEmailStepComponent, TrialStartData } from '../../components/trial-email-step/trial-email-step.component';
import { CompanySetupComponent } from '../../components/company-setup/company-setup.component';
import { OtpStepComponent } from '../../../auth/components/otp-step/otp-step.component';
import { AuthShellComponent } from '../../../auth/components/auth-shell/auth-shell.component';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { OrgThemeService } from '../../../../core/services/org-theme.service';

export type TrialStep = 'email' | 'otp' | 'setup' | 'done';

@Component({
  selector: 'ob-free-trial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TrialEmailStepComponent, OtpStepComponent, AuthShellComponent, CompanySetupComponent],
  templateUrl: './free-trial.component.html',
  styleUrl: './free-trial.component.scss',
})
export class FreeTrialComponent implements OnInit {
  private router = inject(Router);
  private authState = inject(AuthStateService);
  private orgTheme = inject(OrgThemeService);

  step       = signal<TrialStep>('email');
  adminEmail = signal('');
  orgName    = signal('');

  ngOnInit(): void {
    this.orgTheme.reset();
  }

  onEmailSubmitted(data: TrialStartData): void {
    this.orgName.set(data.orgName);
    this.adminEmail.set(data.email);
    this.authState.setEmail(data.email);
    this.step.set('otp');
  }

  onOtpVerified(): void {
    setTimeout(() => this.step.set('setup'), 1500);
  }

  onSetupComplete(): void {
    this.step.set('done');
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.orgTheme.reset();
    this.router.navigate(['/']);
  }
}
