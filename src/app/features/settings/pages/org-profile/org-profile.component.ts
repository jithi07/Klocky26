import {
  Component,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiInputComponent } from '../../../../shared/components/ui-input/ui-input.component';
import { UiTextareaComponent } from '../../../../shared/components/ui-textarea/ui-textarea.component';
import { UiSelectComponent } from '../../../../shared/components/ui-select/ui-select.component';
import { UiToggleComponent } from '../../../../shared/components/ui-toggle/ui-toggle.component';

export interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
}

export interface CustomLeaveType {
  id: string;
  name: string;
  daysPerYear: number;
  isPaid: boolean;
  carryForward: boolean;
  applicableTo: 'all' | 'male' | 'female';
}

export interface Holiday {
  id: string;
  name: string;
  month: number;   // 1–12
  day: number;     // 1–31
  type: 'national' | 'optional' | 'restricted';
}

const HOLIDAY_TYPE_LABELS: Record<Holiday['type'], string> = {
  national:   'National',
  optional:   'Optional',
  restricted: 'Restricted',
};

const DEFAULT_HOLIDAYS: Omit<Holiday, 'id'>[] = [
  // Jan
  { name: 'New Year\'s Day',           month: 1,  day: 1,  type: 'national'   },
  { name: 'Republic Day',              month: 1,  day: 26, type: 'national'   },
  // Mar
  { name: 'Holi',                      month: 3,  day: 14, type: 'optional'   },
  // Apr
  { name: 'Good Friday',               month: 4,  day: 18, type: 'optional'   },
  { name: 'Ambedkar Jayanti',          month: 4,  day: 14, type: 'national'   },
  // May
  { name: 'Labour Day',                month: 5,  day: 1,  type: 'optional'   },
  // Aug
  { name: 'Independence Day',          month: 8,  day: 15, type: 'national'   },
  // Oct
  { name: 'Gandhi Jayanti',            month: 10, day: 2,  type: 'national'   },
  { name: 'Dussehra',                  month: 10, day: 2,  type: 'optional'   },
  // Nov
  { name: 'Diwali',                    month: 11, day: 1,  type: 'optional'   },
  // Dec
  { name: 'Christmas Day',             month: 12, day: 25, type: 'national'   },
];

export const TIMEZONES = [
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

const INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Logistics & Supply Chain',
  'Real Estate',
  'Media & Entertainment',
  'Legal & Consulting',
  'Other',
];

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'UAE',
  'Other',
];

const EMPLOYEE_BANDS = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'];

const CURRENCIES = [
  { label: 'INR — Indian Rupee (₹)', value: 'INR' },
  { label: 'USD — US Dollar ($)', value: 'USD' },
  { label: 'GBP — British Pound (£)', value: 'GBP' },
  { label: 'EUR — Euro (€)', value: 'EUR' },
  { label: 'AED — UAE Dirham (د.إ)', value: 'AED' },
  { label: 'SGD — Singapore Dollar (S$)', value: 'SGD' },
  { label: 'AUD — Australian Dollar (A$)', value: 'AUD' },
];

const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D MMM YYYY'];

const WEEK_STARTS = ['Monday', 'Sunday', 'Saturday'];

const COMPANY_TYPES = [
  'Private Limited',
  'Public Limited',
  'LLP',
  'Partnership',
  'Sole Proprietorship',
  'One Person Company (OPC)',
  'Non-Profit / NGO',
  'Government',
  'Other',
];

const WORKING_DAY_OPTIONS = [
  { label: 'Mon – Fri', value: 'mon-fri' },
  { label: 'Mon – Sat', value: 'mon-sat' },
  { label: 'Mon – Sun', value: 'mon-sun' },
  { label: 'Custom', value: 'custom' },
];

const GRACE_PERIOD_OPTIONS = [
  { label: 'No grace', value: 0 },
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
];

const HALF_DAY_THRESHOLD_OPTIONS = [
  { label: '3 hours', value: 3 },
  { label: '4 hours', value: 4 },
  { label: '5 hours', value: 5 },
];

const LEAVE_YEAR_MONTHS = [
  'January', 'April', 'July', 'October',
];

const ACCENT_PRESETS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#3b82f6',
  '#0ea5e9',
  '#06b6d4',
  '#14b8a6',
  '#10b981',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#ec4899',
];

@Component({
  selector: 'org-profile',
  standalone: true,
  imports: [FormsModule, UiInputComponent, UiTextareaComponent, UiSelectComponent, UiToggleComponent],
  templateUrl: './org-profile.component.html',
  styleUrl: './org-profile.component.scss',
})
export class OrgProfileComponent {
  @ViewChild('logoInput') logoInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('colorInput') colorInputRef!: ElementRef<HTMLInputElement>;

  // ── Reference data ────────────────────────────────────────────
  readonly timezones           = TIMEZONES;
  readonly industries          = INDUSTRIES;
  readonly countries           = COUNTRIES;
  readonly employeeBands       = EMPLOYEE_BANDS;
  readonly currencies          = CURRENCIES;
  readonly dateFormats         = DATE_FORMATS;
  readonly weekStarts          = WEEK_STARTS;
  readonly accentPresets       = ACCENT_PRESETS;
  readonly companyTypes        = COMPANY_TYPES;
  readonly workingDayOptions   = WORKING_DAY_OPTIONS;
  readonly gracePeriodOptions  = GRACE_PERIOD_OPTIONS;
  readonly halfDayOptions      = HALF_DAY_THRESHOLD_OPTIONS;
  readonly leaveYearMonths     = LEAVE_YEAR_MONTHS;
  readonly holidayTypeLabels   = HOLIDAY_TYPE_LABELS;
  readonly allMonths = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  // ── Form state (plain props for ngModel compatibility) ─────────

  // Identity
  companyName  = 'Acme Technologies';
  legalName    = 'Acme Technologies Private Limited';
  companyType  = 'Private Limited';
  foundedYear  = '';
  regNumber    = '';
  gstNumber    = '';
  panNumber    = '';
  esicNumber   = '';
  pfAccount    = '';
  website      = 'https://acme.com';
  description  = '';

  // Branding
  accentColor  = '#6366f1';

  // Contact
  primaryEmail     = 'admin@acme.com';
  secondaryEmails: string[] = [];
  phone            = '';
  billingEmail     = '';

  // Offices
  offices: Office[] = [
    {
      id: '1',
      name: 'Headquarters',
      address: '123 Main Street',
      city: 'Mumbai',
      country: 'India',
      timezone: 'Asia/Kolkata',
    },
  ];

  // Team
  employeeCount  = '51–200';
  industry       = 'Technology';
  hrContactName  = '';
  hrContactEmail = '';

  // Localisation
  defaultTimezone = 'Asia/Kolkata';
  dateFormat      = 'DD/MM/YYYY';
  currency        = 'INR';
  weekStart       = 'Monday';

  // Attendance Policy
  workHoursPerDay      = 8;
  workingDays          = 'mon-fri';
  gracePeriodMins      = 10;
  halfDayThresholdHrs  = 4;
  overtimeEnabled      = false;
  overtimeAfterHrs     = 9;
  geoFencingEnabled    = false;
  remoteCheckinEnabled = true;
  selfieCheckinEnabled = false;
  autoCheckoutEnabled  = false;
  autoCheckoutTime     = '20:00';

  // Leave & Holidays
  leaveYearStart       = 'January';
  annualLeaveDays      = 18;
  sickLeaveDays        = 12;
  casualLeaveDays      = 6;
  carryForwardEnabled  = true;
  carryForwardMaxDays  = 5;
  compOffEnabled       = true;
  lopEnabled           = true;
  encashmentEnabled    = false;

  customLeaveTypes: CustomLeaveType[] = [
    { id: '1', name: 'Maternity Leave',  daysPerYear: 182, isPaid: true,  carryForward: false, applicableTo: 'female' },
    { id: '2', name: 'Paternity Leave',  daysPerYear: 5,   isPaid: true,  carryForward: false, applicableTo: 'male'   },
    { id: '3', name: 'Bereavement Leave',daysPerYear: 3,   isPaid: true,  carryForward: false, applicableTo: 'all'   },
    { id: '4', name: 'Marriage Leave',   daysPerYear: 3,   isPaid: true,  carryForward: false, applicableTo: 'all'   },
  ];

  holidays: Holiday[] = DEFAULT_HOLIDAYS.map((h, i) => ({ ...h, id: String(i + 1) }));

  // ── UI state (signals) ─────────────────────────────────────────
  readonly isDirty             = signal(false);
  readonly saving              = signal(false);
  readonly logoPreview         = signal('');
  readonly activeSection       = signal('identity');
  readonly showDiscardConfirm  = signal(false);
  readonly holidayMonth        = signal(1);  // 1–12, currently viewed month

  markDirty(): void {
    this.isDirty.set(true);
  }

  // ── Logo ───────────────────────────────────────────────────────
  triggerLogo(): void {
    this.logoInputRef.nativeElement.click();
  }

  onLogoSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.logoPreview.set(URL.createObjectURL(file));
      this.markDirty();
    }
  }

  removeLogo(): void {
    this.logoPreview.set('');
    this.markDirty();
  }

  // ── Accent color ───────────────────────────────────────────────
  setAccentColor(color: string): void {
    this.accentColor = color;
    this.markDirty();
  }

  openColorPicker(): void {
    this.colorInputRef.nativeElement.value = this.accentColor;
    this.colorInputRef.nativeElement.click();
  }

  onCustomColor(event: Event): void {
    this.accentColor = (event.target as HTMLInputElement).value;
    this.markDirty();
  }

  // ── Secondary emails ───────────────────────────────────────────
  addSecondaryEmail(): void {
    this.secondaryEmails = [...this.secondaryEmails, ''];
    this.markDirty();
  }

  removeSecondaryEmail(index: number): void {
    this.secondaryEmails = this.secondaryEmails.filter((_, i) => i !== index);
    this.markDirty();
  }

  // ── Offices ────────────────────────────────────────────────────
  addOffice(): void {
    this.offices = [
      ...this.offices,
      { id: Date.now().toString(), name: '', address: '', city: '', country: '', timezone: '' },
    ];
    this.markDirty();
  }

  removeOffice(id: string): void {
    this.offices = this.offices.filter(o => o.id !== id);
    this.markDirty();
  }

  // ── Custom leave types ───────────────────────────────────────
  addCustomLeave(): void {
    this.customLeaveTypes = [
      ...this.customLeaveTypes,
      { id: Date.now().toString(), name: '', daysPerYear: 0, isPaid: true, carryForward: false, applicableTo: 'all' },
    ];
    this.markDirty();
  }

  removeCustomLeave(id: string): void {
    this.customLeaveTypes = this.customLeaveTypes.filter(l => l.id !== id);
    this.markDirty();
  }

  // ── Holidays ──────────────────────────────────────────────
  holidaysForMonth(month: number): Holiday[] {
    return this.holidays
      .filter(h => h.month === month)
      .sort((a, b) => a.day - b.day);
  }

  totalHolidaysForMonth(month: number): number {
    return this.holidays.filter(h => h.month === month).length;
  }

  addHoliday(): void {
    const m = this.holidayMonth();
    this.holidays = [
      ...this.holidays,
      { id: Date.now().toString(), name: '', month: m, day: 1, type: 'national' },
    ];
    this.markDirty();
  }

  removeHoliday(id: string): void {
    this.holidays = this.holidays.filter(h => h.id !== id);
    this.markDirty();
  }

  daysInMonth(month: number): number[] {
    const days = new Date(new Date().getFullYear(), month, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  // ── Save / Discard ─────────────────────────────────────────────
  async save(): Promise<void> {
    this.saving.set(true);
    // TODO: wire to API
    await new Promise(r => setTimeout(r, 900));
    this.saving.set(false);
    this.isDirty.set(false);
  }

  discard(): void {
    if (this.isDirty()) {
      this.showDiscardConfirm.set(true);
    }
  }

  confirmDiscard(): void {
    this.showDiscardConfirm.set(false);
    this.isDirty.set(false);
  }

  cancelDiscard(): void {
    this.showDiscardConfirm.set(false);
  }

  // ── Section navigation ─────────────────────────────────────────
  setSection(section: string): void {
    this.activeSection.set(section);
  }
}
