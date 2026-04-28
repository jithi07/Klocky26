import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthShellComponent } from '../../../auth/components/auth-shell/auth-shell.component';

@Component({
  selector: 'ob-trial-email-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AuthShellComponent],
  template: `
    <klocky-auth-shell>
      <div class="lk-step">

        <div class="lk-eyebrow">
          <span class="lk-dot"></span>
          Free Trial
        </div>

        <h1 class="lk-heading">
          Start your<br/>
          <span class="lk-heading-accent">free trial.</span>
        </h1>
        <p class="lk-subtext">
          Enter your email. We'll send a quick verification code to get you started.
        </p>

        <div class="lk-field">
          <label class="lk-label" for="trial-email">Email <span style="color:#f87171">*</span></label>
          <div class="lk-input-wrap" [class.lk-input-error]="error">
            <svg class="lk-input-icon" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input
              id="trial-email"
              class="lk-input"
              type="email"
              placeholder="you@mail.com"
              [(ngModel)]="email"
              (keydown.enter)="submit()"
              autocomplete="email"
            />
          </div>
          @if (error) { <p class="lk-error-msg">{{ error }}</p> }
        </div>

        <button
          class="lk-btn"
          type="button"
          [disabled]="!email.trim()"
          (click)="submit()"
        >
          Get Started
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p class="lk-legal">
          Already have an account?
          <a href="#" (click)="$event.preventDefault(); signIn.emit()">Sign in</a>
        </p>

        <p class="lk-legal" style="margin-top:8px">
          By continuing you agree to our
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

      </div>
    </klocky-auth-shell>
  `,
  styleUrl: './trial-email-step.component.scss',
})
export class TrialEmailStepComponent {
  @Output() emailSubmitted = new EventEmitter<string>();
  @Output() signIn = new EventEmitter<void>();

  email = '';
  error = '';

  submit(): void {
    this.error = '';
    const trimmed = this.email.trim();
    if (!trimmed) return;

    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.emailSubmitted.emit(trimmed);
  }
}
