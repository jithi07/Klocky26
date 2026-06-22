import {
  Component, Output, EventEmitter, Input,
  ViewChildren, QueryList, ElementRef, ChangeDetectorRef, inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { OrgAuthService } from '../../../../core/services/org-auth.service';

@Component({
  selector: 'klocky-otp-step',
  standalone: true,
  imports: [FormsModule, SlicePipe],
  templateUrl: './otp-step.component.html',
  styleUrl: './otp-step.component.scss',
})
export class OtpStepComponent {
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;
  /** Emits the single-use verificationToken (4h validity) once verify-otp succeeds. */
  @Output() verified = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();
  /** Context label shown in the success state — pass org display name */
  @Input() orgName = '';
  /** Set to true when OTP is part of the registration flow */
  @Input() isRegistration = false;

  private cdr = inject(ChangeDetectorRef);
  private orgAuth = inject(OrgAuthService);

  otp: string[] = ['', '', '', '', '', ''];
  loading = false;
  error = '';
  success = false;
  resendSeconds = 0;
  private resendTimer?: ReturnType<typeof setInterval>;

  constructor(public state: AuthStateService) {
    this.startResendTimer();
  }

  get maskedEmail(): string {
    const email = this.state.email();
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const masked = user.slice(0, 2) + '•'.repeat(Math.max(user.length - 2, 3));
    return `${masked}@${domain}`;
  }

  get otpComplete(): boolean { return this.otp.every(d => d !== ''); }

verifyOtp(): void {
    if (!this.otpComplete || this.loading) return;
    this.error = '';
    this.loading = true;

    const code = this.otp.join('');
    this.orgAuth.verifyOtp({ email: this.state.email(), otp: code }).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.verified.emit(res.data.verificationToken);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Invalid code. Please check and try again.';
        this.otp = ['', '', '', '', '', ''];
        this.cdr.markForCheck();
        setTimeout(() => {
          this.otpBoxes.toArray().forEach(b => { b.nativeElement.value = ''; });
          this.otpBoxes.first?.nativeElement.focus();
        }, 50);
      },
    });
  }

  startResendTimer(): void {
    this.resendSeconds = 30;
    clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      this.resendSeconds--;
      this.cdr.markForCheck();
      if (this.resendSeconds <= 0) clearInterval(this.resendTimer);
    }, 1000);
  }

  resendOtp(): void {
    if (this.resendSeconds > 0) return;
    this.otp = ['', '', '', '', '', ''];
    this.error = '';
    this.loading = true;
    this.orgAuth.sendOtp({ organisationName: this.orgName, email: this.state.email() }).subscribe({
      next: () => {
        this.loading = false;
        this.startResendTimer();
        setTimeout(() => this.otpBoxes.first?.nativeElement.focus(), 50);
      },
      error: (err) => {
        this.loading = false;
        // 409 = 30s resend cooldown still active server-side
        this.error = err?.error?.message ?? 'Could not resend code. Please try again shortly.';
      },
    });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    this.otp[index] = val;
    input.value = val;
    if (this.error) this.error = ''; // clear error when user starts re-entering
    if (val && index < 5) this.otpBoxes.toArray()[index + 1]?.nativeElement.focus();
    if (this.otpComplete) setTimeout(() => this.verifyOtp(), 200);
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
    if (digits.length === 6) setTimeout(() => this.verifyOtp(), 200);
  }
}
