import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';

@Component({
  selector: 'klocky-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthShellComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private router = inject(Router);

  email = '';
  error = signal('');
  loading = signal(false);
  success = signal(false);

  async sendResetLink() {
    if (!this.email.trim()) {
      this.error.set('Please enter your email address');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error.set('Please enter a valid email address');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    try {
      // NOTE: the backend (INTEGRATION_GUIDE.md §3) defines no forgot-password
      // endpoint for employees — only change-password (current + new) while
      // logged in. This screen is intentionally not wired to a real call yet;
      // do not fake success once a real endpoint exists, replace this delay.
      await this.delay(1500);

      this.success.set(true);
      this.loading.set(false);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Failed to send reset link. Please try again.');
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
