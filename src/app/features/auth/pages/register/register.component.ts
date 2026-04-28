import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { AuthStateService } from '../../services/auth-state.service';
import { OtpStepComponent } from '../../components/otp-step/otp-step.component';
import { UiSelectComponent } from '../../../../shared/components/ui-select/ui-select.component';

type RegStep = 'org-info' | 'admin-email' | 'otp' | 'org-profile' | 'done';

@Component({
  selector: 'klocky-register',
  standalone: true,
  imports: [AuthShellComponent, FormsModule, SlicePipe, OtpStepComponent, UiSelectComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  step: RegStep = 'org-info';

  // ── Step 1: workspace ────────────────────────────────────────
  orgName = '';
  orgSlug = '';
  orgSlugTouched = false;

  // ── Step 2: admin ────────────────────────────────────────────
  adminEmail = '';
  adminName = '';

  // ── Step 4: org profile ──────────────────────────────────────
  industry = '';
  companySize = '';
  country = '';
  timezone = '';
  workWeekStart = 'Monday';
  workWeekEnd = 'Friday';
  workDayStart = '09:00';
  workDayEnd = '18:00';
  website = '';

  loading = false;
  error = '';

  readonly authState = inject(AuthStateService);
  private router = inject(Router);

  // ── Industries ───────────────────────────────────────────────
  readonly industries = [
    'Technology', 'Finance & Banking', 'Healthcare', 'Education',
    'Retail & E-commerce', 'Manufacturing', 'Media & Entertainment',
    'Hospitality', 'Construction', 'Consulting', 'Government', 'Other',
  ];

  readonly companySizes = [
    '1 – 10', '11 – 50', '51 – 200', '201 – 500', '501 – 1000', '1000+',
  ];

  readonly timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00 (Hawaii)', 'UTC-08:00 (Pacific)',
    'UTC-07:00 (Mountain)', 'UTC-06:00 (Central)', 'UTC-05:00 (Eastern)',
    'UTC-04:00 (Atlantic)', 'UTC-03:00 (Brasilia)', 'UTC+00:00 (London)',
    'UTC+01:00 (Paris)', 'UTC+02:00 (Cairo)', 'UTC+03:00 (Moscow)',
    'UTC+04:00 (Dubai)', 'UTC+05:30 (India)', 'UTC+06:00 (Dhaka)',
    'UTC+07:00 (Bangkok)', 'UTC+08:00 (Singapore)', 'UTC+09:00 (Tokyo)',
    'UTC+10:00 (Sydney)', 'UTC+12:00 (Auckland)',
  ];

  readonly weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  // ── Slug auto-generation ──────────────────────────────────────
  onOrgNameChange(): void {
    if (!this.orgSlugTouched) {
      this.orgSlug = this.orgName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

  // ── Step 1 ───────────────────────────────────────────────────
  async submitOrgInfo(): Promise<void> {
    if (!this.orgName.trim() || !this.orgSlug.trim() || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(700);
    this.loading = false;
    this.authState.setOrg(this.orgSlug, this.orgName.trim());
    this.step = 'admin-email';
  }

  // ── Step 2 ───────────────────────────────────────────────────
  async submitAdminEmail(): Promise<void> {
    if (!this.adminEmail.trim() || !this.adminName.trim() || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(900);
    this.loading = false;
    this.authState.setEmail(this.adminEmail.trim());
    this.step = 'otp';
  }

  // ── Step 3: OTP verified → org profile ───────────────────────
  onOtpVerified(): void {
    this.step = 'org-profile';
  }

  // ── Step 4: org profile ───────────────────────────────────────
  async submitOrgProfile(): Promise<void> {
    if (!this.industry || !this.companySize || !this.country || !this.timezone || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(1000);
    this.loading = false;
    this.step = 'done';
  }

  skipProfile(): void {
    this.step = 'done';
  }

  // ── Step 5: done ──────────────────────────────────────────────
  async goToDashboard(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    await this.delay(600);
    this.router.navigate(['/app/dashboard']);
  }

  goBack(): void {
    if (this.step === 'admin-email') this.step = 'org-info';
    else if (this.step === 'otp')    this.step = 'admin-email';
  }

  goLogin(): void { this.router.navigate(['/login']); }

  stepIndex(): number {
    return { 'org-info': 1, 'admin-email': 2, 'otp': 3, 'org-profile': 4, 'done': 5 }[this.step];
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}

