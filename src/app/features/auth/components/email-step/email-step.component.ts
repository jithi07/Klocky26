import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'klocky-email-step',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './email-step.component.html',
  styleUrl: './email-step.component.scss',
})
export class EmailStepComponent {
  @Output() otpSent = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  emailInput = '';
  loading = false;
  error = '';

  constructor(public state: AuthStateService) {}

  async requestOtp(): Promise<void> {
    if (!this.emailInput.trim() || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(1200);
    this.loading = false;
    this.state.setEmail(this.emailInput.trim());
    this.otpSent.emit();
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
