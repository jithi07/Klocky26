import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'klocky-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // ── State ────────────────────────────────────────────────────
  step: 'email' | 'otp' = 'email';
  email = '';
  otp: string[] = ['', '', '', '', '', ''];
  loading = false;
  resendSeconds = 0;
  error = '';
  success = false;

  private resendTimer?: ReturnType<typeof setInterval>;

  // ── Getters ──────────────────────────────────────────────────
  get maskedEmail(): string {
    const [user, domain] = this.email.split('@');
    if (!domain) return this.email;
    const masked = user.slice(0, 2) + '•'.repeat(Math.max(user.length - 2, 3));
    return `${masked}@${domain}`;
  }

  get otpValue(): string {
    return this.otp.join('');
  }

  get otpComplete(): boolean {
    return this.otp.every(d => d !== '');
  }

  // ── Step 1: request OTP ──────────────────────────────────────
  async requestOtp(): Promise<void> {
    if (!this.email || this.loading) return;
    this.error = '';
    this.loading = true;

    // Simulate API call
    await this.delay(1200);

    this.loading = false;
    this.step = 'otp';
    this.startResendTimer();

    // Focus first OTP box after render
    setTimeout(() => {
      this.otpBoxes.first?.nativeElement.focus();
    }, 80);
  }

  // ── Step 2: verify OTP ───────────────────────────────────────
  async verifyOtp(): Promise<void> {
    if (!this.otpComplete || this.loading) return;
    this.error = '';
    this.loading = true;

    await this.delay(1000);

    this.loading = false;
    this.success = true;

    await this.delay(800);
    this.router.navigate(['/app/dashboard']);
  }

  // ── Resend ───────────────────────────────────────────────────
  startResendTimer(): void {
    this.resendSeconds = 30;
    clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      this.resendSeconds--;
      this.cdr.markForCheck();
      if (this.resendSeconds <= 0) clearInterval(this.resendTimer);
    }, 1000);
  }

  async resendOtp(): Promise<void> {
    if (this.resendSeconds > 0) return;
    this.otp = ['', '', '', '', '', ''];
    this.error = '';
    this.loading = true;
    await this.delay(800);
    this.loading = false;
    this.startResendTimer();
    setTimeout(() => this.otpBoxes.first?.nativeElement.focus(), 50);
  }

  // ── OTP input handling ───────────────────────────────────────
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);

    this.otp[index] = val;
    input.value = val;

    if (val && index < 5) {
      this.otpBoxes.toArray()[index + 1]?.nativeElement.focus();
    }

    if (this.otpComplete) {
      setTimeout(() => this.verifyOtp(), 200);
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (!this.otp[index] && index > 0) {
        this.otp[index - 1] = '';
        this.otpBoxes.toArray()[index - 1]?.nativeElement.focus();
        event.preventDefault();
      } else {
        this.otp[index] = '';
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.otpBoxes.toArray()[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.otpBoxes.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    digits.forEach((d, i) => { this.otp[i] = d; });
    const focusIdx = Math.min(digits.length, 5);
    this.otpBoxes.toArray()[focusIdx]?.nativeElement.focus();

    if (digits.length === 6) {
      setTimeout(() => this.verifyOtp(), 200);
    }
  }

  // ── Go back ──────────────────────────────────────────────────
  goBack(): void {
    this.step = 'email';
    this.otp = ['', '', '', '', '', ''];
    this.error = '';
    this.success = false;
    clearInterval(this.resendTimer);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}
