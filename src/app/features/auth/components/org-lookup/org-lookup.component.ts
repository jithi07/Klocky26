import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { OrgThemeService } from '../../../../core/services/org-theme.service';
import { OrgAuthService } from '../../../../core/services/org-auth.service';

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

  private orgAuth = inject(OrgAuthService);

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

  proceed(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.error = '';

    const raw: string = this.form.value.orgInput.trim();

    // Secret admin code — navigate straight to the admin panel, skip org flow
    if (raw === ADMIN_CODE) {
      this.orgTheme.reset();
      this.router.navigate(['/klocky-admin']);
      return;
    }

    this.loading = true;
    const slug = raw.toLowerCase().replace(/\s+/g, '-');

    this.orgAuth.validateSlug(slug).subscribe({
      next: (res) => {
        this.loading = false;
        if (!res.data.isValid) {
          this.error = `We couldn't find a workspace at "${slug}". Check the spelling, or register a new organisation.`;
          return;
        }
        this.state.setOrg(res.data.orgSlug, res.data.companyName);
        // Org colour theme is applied once the credentials step succeeds and
        // the org's accentColor is known — stay on the default theme here.
        this.found.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.status === 404
          ? `We couldn't find a workspace at "${slug}". Check the spelling, or register a new organisation.`
          : (err?.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}
