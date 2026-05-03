import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrgThemeService } from '../../../../core/services/org-theme.service';

// In production this would be validated server-side.
// Never embed credentials in a client — this is a placeholder pattern.
const TEAM_EMAIL    = 'admin.klock@gmail.com';
const TEAM_PASSWORD = 'Klock2026';

@Component({
  selector: 'klocky-admin-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  readonly submitting = signal(false);
  readonly loginError = signal('');

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orgTheme: OrgThemeService,
  ) {
    // Ensure default theme while on the admin login screen
    this.orgTheme.reset();

    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;

    this.loginError.set('');
    this.submitting.set(true);
    await this.delay(800);
    this.submitting.set(false);

    const { email, password } = this.form.value;
    if (email === TEAM_EMAIL && password === TEAM_PASSWORD) {
      this.router.navigate(['/klocky-admin/dashboard']);
    } else {
      this.loginError.set('Invalid email or password. Please try again.');
    }
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
