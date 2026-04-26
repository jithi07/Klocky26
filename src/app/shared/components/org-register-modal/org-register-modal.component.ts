import {
  Component, ChangeDetectionStrategy, signal, inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { OrgRegisterModalService, OrgRegisterForm } from './org-register-modal.service';

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Education',
  'Retail & E-commerce', 'Manufacturing', 'Logistics & Supply Chain',
  'Real Estate', 'Media & Entertainment', 'Legal & Consulting', 'Other',
];

const EMPLOYEE_BANDS = [
  '1–10', '11–50', '51–200', '201–500', '501–1000', '1000+',
];

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Singapore', 'UAE', 'Other',
];

const TIMEZONES = [
  { label: 'IST — India Standard Time (UTC+5:30)', value: 'Asia/Kolkata' },
  { label: 'EST — Eastern Time (UTC−5)', value: 'America/New_York' },
  { label: 'CST — Central Time (UTC−6)', value: 'America/Chicago' },
  { label: 'PST — Pacific Time (UTC−8)', value: 'America/Los_Angeles' },
  { label: 'GMT — Greenwich Mean Time (UTC+0)', value: 'Europe/London' },
  { label: 'CET — Central European Time (UTC+1)', value: 'Europe/Berlin' },
  { label: 'SGT — Singapore Time (UTC+8)', value: 'Asia/Singapore' },
  { label: 'GST — Gulf Standard Time (UTC+4)', value: 'Asia/Dubai' },
  { label: 'AEST — Australian Eastern Time (UTC+10)', value: 'Australia/Sydney' },
];

@Component({
  selector: 'org-register-modal',
  standalone: true,
  imports: [FormsModule, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="orm-backdrop" (click)="onBackdrop($event)">
        <div class="orm-box" role="dialog" aria-modal="true"
             aria-labelledby="orm-title" (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="orm-header">
            <div class="orm-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <h2 class="orm-title" id="orm-title">Register Organisation</h2>
              <p class="orm-sub">Set up your workspace in under a minute</p>
            </div>
            <button class="orm-close" (click)="close()" type="button" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Step indicator -->
          <div class="orm-steps">
            <div class="orm-step" [class.active]="step() === 1" [class.done]="step() > 1">
              <span class="step-num">{{ step() > 1 ? '✓' : '1' }}</span>
              <span class="step-label">Company</span>
            </div>
            <div class="orm-step-line" [class.done]="step() > 1"></div>
            <div class="orm-step" [class.active]="step() === 2" [class.done]="step() > 2">
              <span class="step-num">{{ step() > 2 ? '✓' : '2' }}</span>
              <span class="step-label">Details</span>
            </div>
            <div class="orm-step-line" [class.done]="step() > 2"></div>
            <div class="orm-step" [class.active]="step() === 3">
              <span class="step-num">3</span>
              <span class="step-label">Location</span>
            </div>
          </div>

          <!-- Body -->
          <div class="orm-body">

            <!-- Step 1: Company identity -->
            @if (step() === 1) {
              <div class="orm-step-panel">
                <div class="orm-row">
                  <div class="orm-col">
                    <label class="orm-label">Company Name <span class="req">*</span></label>
                    <input class="orm-input" type="text"
                           placeholder="e.g. Acme Technologies"
                           [(ngModel)]="form.companyName"
                           [class.error]="touched() && !form.companyName.trim()" />
                    @if (touched() && !form.companyName.trim()) {
                      <span class="orm-err">Company name is required</span>
                    }
                  </div>

                  <div class="orm-col">
                    <label class="orm-label">Legal / Registered Name <span class="req">*</span></label>
                    <input class="orm-input" type="text"
                           placeholder="e.g. Acme Technologies Private Limited"
                           [(ngModel)]="form.legalName"
                           [class.error]="touched() && !form.legalName.trim()" />
                    <span class="orm-hint">As it appears on official documents</span>
                    @if (touched() && !form.legalName.trim()) {
                      <span class="orm-err">Legal name is required</span>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Step 2: Team & industry -->
            @if (step() === 2) {
              <div class="orm-step-panel">
                <div class="orm-field">
                  <label class="orm-label">Number of Employees <span class="req">*</span></label>
                  <div class="orm-band-grid">
                    @for (band of employeeBands; track band) {
                      <button type="button" class="orm-band-btn"
                              [class.selected]="form.employeeCount === band"
                              (click)="form.employeeCount = band">
                        {{ band }}
                      </button>
                    }
                  </div>
                  @if (touched() && !form.employeeCount) {
                    <span class="orm-err">Please select a range</span>
                  }
                </div>

                <div class="orm-field">
                  <label class="orm-label">Industry <span class="req">*</span></label>
                  <div class="orm-select-wrap">
                    <select class="orm-select"
                            [(ngModel)]="form.industry"
                            [class.error]="touched() && !form.industry">
                      <option value="">Select industry…</option>
                      <option *ngFor="let i of industries" [value]="i">{{ i }}</option>
                    </select>
                    <svg class="orm-select-icon" width="14" height="14" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  @if (touched() && !form.industry) {
                    <span class="orm-err">Industry is required</span>
                  }
                </div>
              </div>
            }

            <!-- Step 3: Location & timezone -->
            @if (step() === 3) {
              <div class="orm-step-panel">
                <div class="orm-row">
                  <div class="orm-col orm-field">
                    <label class="orm-label">Country <span class="req">*</span></label>
                    <div class="orm-select-wrap">
                      <select class="orm-select"
                              [(ngModel)]="form.country"
                              [class.error]="touched() && !form.country">
                        <option value="">Select country…</option>
                        <option *ngFor="let c of countries" [value]="c">{{ c }}</option>
                      </select>
                      <svg class="orm-select-icon" width="14" height="14" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2.5"
                           stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    @if (touched() && !form.country) {
                      <span class="orm-err">Country is required</span>
                    }
                  </div>

                  <div class="orm-col orm-field">
                    <label class="orm-label">Time Zone <span class="req">*</span></label>
                    <div class="orm-select-wrap">
                      <select class="orm-select"
                              [(ngModel)]="form.timezone"
                              [class.error]="touched() && !form.timezone">
                        <option value="">Select timezone…</option>
                        <option *ngFor="let tz of timezones" [value]="tz.value">{{ tz.label }}</option>
                      </select>
                      <svg class="orm-select-icon" width="14" height="14" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2.5"
                           stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    @if (touched() && !form.timezone) {
                      <span class="orm-err">Timezone is required</span>
                    }
                  </div>
                </div>
              </div>
            }

          </div>

          <!-- Footer -->
          <div class="orm-footer">
            @if (step() > 1) {
              <button class="orm-btn orm-btn-ghost" type="button" (click)="back()">
                ← Back
              </button>
            } @else {
              <span></span>
            }
            @if (step() < 3) {
              <button class="orm-btn orm-btn-primary" type="button" (click)="next()">
                Continue →
              </button>
            } @else {
              <button class="orm-btn orm-btn-primary orm-btn-submit"
                      type="button" (click)="submit()"
                      [disabled]="submitting()">
                @if (submitting()) {
                  <span class="orm-spinner"></span> Saving…
                } @else {
                  Register Organisation
                }
              </button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    /* ── Backdrop ── */
    .orm-backdrop {
      position: fixed; inset: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 6000; padding: 16px;
      animation: orm-fade .2s ease;
    }
    @keyframes orm-fade { from { opacity: 0; } to { opacity: 1; } }

    /* ── Box ── */
    .orm-box {
      background: #fff;
      border-radius: 22px;
      width: 70vw; max-width: 960px; min-width: 560px;
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      box-shadow: 0 24px 80px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.08);
      animation: orm-in .25s cubic-bezier(.34,1.56,.64,1);
      display: flex; flex-direction: column;
    }
    @keyframes orm-in {
      from { opacity: 0; transform: scale(.92) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ── Header ── */
    .orm-header {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 28px 28px 0;
      flex-shrink: 0;
    }
    .orm-header-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      color: #4f46e5;
      display: flex; align-items: center; justify-content: center;
    }
    .orm-title {
      margin: 0; font-size: 20px; font-weight: 800; color: #111827;
      letter-spacing: -0.4px;
    }
    .orm-sub {
      margin: 4px 0 0; font-size: 13.5px; color: #6b7280;
    }
    .orm-close {
      margin-left: auto; flex-shrink: 0;
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      border: none; background: none; cursor: pointer; border-radius: 8px;
      color: #9ca3af; transition: background .12s, color .12s;
    }
    .orm-close:hover { background: #f3f4f6; color: #374151; }

    /* ── Step indicator ── */
    .orm-steps {
      display: flex; align-items: center;
      padding: 22px 28px 0; gap: 0;
      flex-shrink: 0;
    }
    .orm-step {
      display: flex; align-items: center; gap: 7px;
      flex-shrink: 0;
    }
    .step-num {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      background: #f1f5f9; color: #94a3b8;
      transition: background .2s, color .2s;
    }
    .orm-step.active .step-num {
      background: #4f46e5; color: #fff;
    }
    .orm-step.done .step-num {
      background: #dcfce7; color: #16a34a;
      font-size: 14px;
    }
    .step-label {
      font-size: 12.5px; font-weight: 600; color: #9ca3af;
      transition: color .2s;
    }
    .orm-step.active .step-label { color: #4f46e5; }
    .orm-step.done .step-label  { color: #16a34a; }
    .orm-step-line {
      flex: 1; height: 2px; background: #e5e7eb;
      margin: 0 10px; border-radius: 2px;
      transition: background .3s;
    }
    .orm-step-line.done { background: #86efac; }

    /* ── Two-column row ── */
    .orm-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    .orm-col { display: flex; flex-direction: column; gap: 6px; }

    /* ── Body ── */
    .orm-body { padding: 24px 28px; flex: 1; }
    .orm-step-panel { display: flex; flex-direction: column; gap: 22px; }

    /* ── Field ── */
    .orm-field { display: flex; flex-direction: column; gap: 6px; }
    .orm-label {
      font-size: 13.5px; font-weight: 600; color: #374151;
    }
    .req { color: #ef4444; margin-left: 2px; }

    .orm-input {
      height: 46px; padding: 0 16px;
      border: 1.5px solid #d1d5db; border-radius: 11px;
      font-size: 14.5px; color: #111827;
      background: #fafafa;
      outline: none;
      transition: border-color .15s, box-shadow .15s;
    }
    .orm-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,.12);
      background: #fff;
    }
    .orm-input.error { border-color: #f87171; }

    .orm-hint { font-size: 12px; color: #9ca3af; }
    .orm-err  { font-size: 12px; color: #ef4444; font-weight: 500; }

    /* ── Employee band grid ── */
    .orm-band-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    }
    .orm-band-btn {
      height: 44px; border-radius: 10px;
      border: 1.5px solid #e5e7eb;
      background: #fafafa; color: #374151;
      font-size: 13.5px; font-weight: 600;
      cursor: pointer;
      transition: border-color .15s, background .15s, color .15s;
    }
    .orm-band-btn:hover {
      border-color: #a5b4fc; background: #eef2ff; color: #4f46e5;
    }
    .orm-band-btn.selected {
      border-color: #4f46e5; background: #eef2ff; color: #4f46e5;
    }

    /* ── Select ── */
    .orm-select-wrap { position: relative; }
    .orm-select {
      width: 100%; height: 46px; padding: 0 38px 0 16px;
      border: 1.5px solid #d1d5db; border-radius: 11px;
      font-size: 14.5px; color: #111827;
      background: #fafafa;
      appearance: none; outline: none;
      cursor: pointer;
      transition: border-color .15s, box-shadow .15s;
    }
    .orm-select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,.12);
      background: #fff;
    }
    .orm-select.error { border-color: #f87171; }
    .orm-select-icon {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%);
      pointer-events: none; color: #9ca3af;
    }

    /* ── Footer ── */
    .orm-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 28px 24px;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
    }
    .orm-btn {
      height: 44px; padding: 0 24px; border-radius: 11px;
      border: none; cursor: pointer;
      font-size: 14px; font-weight: 600;
      transition: background .15s, transform .12s;
      display: flex; align-items: center; gap: 6px;
    }
    .orm-btn:active { transform: scale(.97); }
    .orm-btn-ghost {
      background: #f1f5f9; color: #374151;
    }
    .orm-btn-ghost:hover { background: #e5e7eb; }
    .orm-btn-primary {
      background: #4f46e5; color: #fff;
      box-shadow: 0 2px 10px rgba(79,70,229,.32);
    }
    .orm-btn-primary:hover { background: #4338ca; }
    .orm-btn-primary:disabled { opacity: .65; cursor: not-allowed; }
    .orm-btn-submit { min-width: 188px; justify-content: center; }

    /* ── Spinner ── */
    .orm-spinner {
      width: 15px; height: 15px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,.35);
      border-top-color: #fff;
      animation: orm-spin .7s linear infinite;
      display: inline-block;
    }
    @keyframes orm-spin { to { transform: rotate(360deg); } }

    /* ── Mobile ── */
    @media (max-width: 600px) {
      .orm-backdrop { padding: 0; align-items: flex-end; }
      .orm-box {
        border-radius: 22px 22px 0 0;
        max-width: 100%; min-width: 0; width: 100%;
        max-height: 92dvh;
        animation: orm-slide-up .28s cubic-bezier(.34,1.2,.64,1);
      }
      @keyframes orm-slide-up {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .orm-row { grid-template-columns: 1fr; gap: 16px; }
      .orm-header { padding: 20px 20px 0; }
      .orm-steps  { padding: 18px 20px 0; }
      .orm-body   { padding: 18px 20px; }
      .orm-footer { padding: 12px 20px 20px; }
      .orm-band-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .orm-band-btn { height: 48px; font-size: 14px; }
      .orm-btn { height: 48px; font-size: 14.5px; }
      .orm-btn-submit { flex: 1; min-width: 0; }
      .orm-btn-ghost { flex-shrink: 0; }
      .orm-title { font-size: 18px; }
    }

    @media (max-width: 380px) {
      .step-label { display: none; }
      .orm-band-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class OrgRegisterModalComponent {
  private svc = inject(OrgRegisterModalService);

  readonly isOpen = this.svc.open;
  step = signal(1);
  touched = signal(false);
  submitting = signal(false);

  readonly industries = INDUSTRIES;
  readonly employeeBands = EMPLOYEE_BANDS;
  readonly countries = COUNTRIES;
  readonly timezones = TIMEZONES;

  form: OrgRegisterForm = {
    companyName: '',
    legalName: '',
    employeeCount: '',
    industry: '',
    country: '',
    timezone: '',
  };

  private step1Valid(): boolean {
    return !!this.form.companyName.trim() && !!this.form.legalName.trim();
  }

  private step2Valid(): boolean {
    return !!this.form.employeeCount && !!this.form.industry;
  }

  private step3Valid(): boolean {
    return !!this.form.country && !!this.form.timezone;
  }

  next(): void {
    this.touched.set(true);
    if (this.step() === 1 && !this.step1Valid()) return;
    if (this.step() === 2 && !this.step2Valid()) return;
    this.touched.set(false);
    this.step.update(s => s + 1);
  }

  back(): void {
    this.touched.set(false);
    this.step.update(s => s - 1);
  }

  submit(): void {
    this.touched.set(true);
    if (!this.step3Valid()) return;
    this.submitting.set(true);
    // TODO: wire to API
    setTimeout(() => {
      this.submitting.set(false);
      this.svc.close(this.form);
      this.reset();
    }, 900);
  }

  close(): void {
    this.svc.close(null);
    this.reset();
  }

  onBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('orm-backdrop')) {
      this.close();
    }
  }

  private reset(): void {
    this.step.set(1);
    this.touched.set(false);
    this.submitting.set(false);
    this.form = { companyName: '', legalName: '', employeeCount: '', industry: '', country: '', timezone: '' };
  }
}
