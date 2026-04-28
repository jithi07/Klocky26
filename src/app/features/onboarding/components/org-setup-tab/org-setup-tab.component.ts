import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiSelectComponent } from '../../../../shared/components/ui-select/ui-select.component';

export interface OrgSetupData {
  orgName: string;
  displayName: string;
  emailDomain: string;
  industry: string;
  companySize: string;
  country: string;
  timezone: string;
  website: string;
}

@Component({
  selector: 'ob-org-setup-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiSelectComponent],
  templateUrl: './org-setup-tab.component.html',
  styleUrl: './org-setup-tab.component.scss',
})
export class OrgSetupTabComponent {
  @Input() set initialData(v: OrgSetupData) { Object.assign(this, v); }
  @Output() dataChange = new EventEmitter<OrgSetupData>();

  orgName     = '';
  displayName = '';
  emailDomain = '';
  industry    = '';
  companySize = '';
  country     = '';
  timezone    = '';
  website     = '';

  readonly industries = [
    'Technology', 'Healthcare', 'Finance & Banking', 'Education',
    'Retail & E-commerce', 'Manufacturing', 'Logistics & Supply Chain',
    'Media & Entertainment', 'Professional Services', 'Real Estate',
    'Hospitality & Tourism', 'Non-profit / NGO', 'Government', 'Other',
  ];

  readonly companySizes = [
    '1 – 10', '11 – 50', '51 – 200', '201 – 500', '501 – 1,000', '1,000+',
  ];

  readonly countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Singapore', 'UAE', 'Netherlands',
    'Brazil', 'Japan', 'South Korea', 'South Africa', 'Other',
  ];

  readonly timezones = [
    'UTC−12:00 — Baker Island', 'UTC−08:00 — Pacific Time (US)',
    'UTC−07:00 — Mountain Time (US)', 'UTC−06:00 — Central Time (US)',
    'UTC−05:00 — Eastern Time (US)', 'UTC−04:00 — Atlantic Time',
    'UTC−03:00 — Brasília', 'UTC+00:00 — UTC / Greenwich',
    'UTC+01:00 — Central European Time', 'UTC+02:00 — Eastern European Time',
    'UTC+03:00 — Moscow / Riyadh', 'UTC+04:00 — Gulf Standard Time',
    'UTC+05:00 — Pakistan Standard Time', 'UTC+05:30 — India Standard Time',
    'UTC+06:00 — Bangladesh Standard Time', 'UTC+07:00 — Indochina Time',
    'UTC+08:00 — China / Singapore / HK', 'UTC+09:00 — Japan / Korea',
    'UTC+10:00 — Australia Eastern', 'UTC+12:00 — New Zealand',
  ];

  get isValid(): boolean {
    return !!(this.orgName.trim() && this.displayName.trim() &&
              this.industry && this.companySize && this.country && this.timezone);
  }

  getData(): OrgSetupData {
    return {
      orgName:     this.orgName.trim(),
      displayName: this.displayName.trim(),
      emailDomain: this.emailDomain.trim(),
      industry:    this.industry,
      companySize: this.companySize,
      country:     this.country,
      timezone:    this.timezone,
      website:     this.website.trim(),
    };
  }

  emit(): void {
    this.dataChange.emit(this.getData());
  }
}
