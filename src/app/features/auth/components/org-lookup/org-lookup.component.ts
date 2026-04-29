import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { OrgThemeService } from '../../../../core/services/org-theme.service';

/** Secret code that bypasses the normal org flow and goes straight to the admin panel */
const ADMIN_CODE = 'klock2026';

@Component({
  selector: 'klocky-org-lookup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './org-lookup.component.html',
  styleUrl: './org-lookup.component.scss',
})
export class OrgLookupComponent {
  @Output() found    = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  goHome(): void {
    this.router.navigate(['/']);
  }

  loading = false;
  error = '';

  form: FormGroup;

  constructor(
    private state: AuthStateService,
    private orgTheme: OrgThemeService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      orgInput: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  async proceed(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.error = '';
    this.loading = true;

    const raw: string = this.form.value.orgInput.trim();

    // Secret admin code — navigate straight to the admin panel, skip org flow
    if (raw === ADMIN_CODE) {
      this.loading = false;
      this.orgTheme.reset();
      this.router.navigate(['/klocky-admin']);
      return;
    }

    await this.delay(900);
    this.loading = false;

    const slug = raw.toLowerCase().replace(/\s+/g, '-');
    this.state.setOrg(slug, raw);

    // Apply the org's colour theme immediately — unknown slugs fall back to
    // default; the 'klocky' slug is explicitly mapped to the default theme.
    this.orgTheme.apply(slug);

    this.found.emit();
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
