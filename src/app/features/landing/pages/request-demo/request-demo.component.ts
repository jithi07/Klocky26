import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { COMPANY_SIZES } from '../../../../core/config/form-options.const';
import { OrgThemeService } from '../../../../core/services/org-theme.service';

@Component({
  selector: 'klocky-request-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './request-demo.component.html',
  styleUrl: './request-demo.component.scss',
})
export class RequestDemoComponent implements OnInit {
  readonly teamSizes = COMPANY_SIZES;
  readonly submitting = signal(false);
  readonly submitted  = signal(false);

  form: FormGroup;
  private orgTheme = inject(OrgThemeService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      fullName:    ['', [Validators.required, Validators.minLength(2)]],
      workEmail:   ['', [Validators.required, Validators.email]],
      phone:       ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)]],
      companyName: ['', [Validators.minLength(2)]],
      message:     ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.orgTheme.reset();
  }

  get f() { return this.form.controls; }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    await this.delay(1200);
    this.submitting.set(false);
    this.submitted.set(true);
  }

  goHome(): void { this.router.navigate(['/']); }
  goTrial(): void { this.router.navigate(['/free-trial']); }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
