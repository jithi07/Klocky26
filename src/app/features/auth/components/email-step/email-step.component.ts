import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'klocky-email-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './email-step.component.html',
  styleUrl: './email-step.component.scss',
})
export class EmailStepComponent {
  @Output() loggedIn = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  loading = false;
  error = '';
  showPassword = false;

  form: FormGroup;

  constructor(public state: AuthStateService, private fb: FormBuilder) {
    this.form = this.fb.group({
      emailInput:    ['', [Validators.required, Validators.email]],
      passwordInput: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailInvalid(): boolean {
    const ctrl = this.form.get('emailInput')!;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  get passwordInvalid(): boolean {
    const ctrl = this.form.get('passwordInput')!;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async login(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(1000);
    this.loading = false;
    this.state.setEmail(this.form.value.emailInput.trim());
    console.log('[Login] credentials:', {
      email: this.form.value.emailInput.trim(),
      password: '***',
    });
    this.loggedIn.emit();
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
