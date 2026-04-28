import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiSelectComponent } from '../../../../shared/components/ui-select/ui-select.component';

export interface AttendanceSetupData {
  clockInMethods: string[];
  workWeekStart: string;
  workWeekEnd: string;
  workDayStart: string;
  workDayEnd: string;
  gracePeriod: string;
  lateThreshold: string;
  locationRule: string;
  requirePhoto: boolean;
  ipRestriction: boolean;
  selfieVerification: boolean;
}

@Component({
  selector: 'ob-attendance-setup-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiSelectComponent],
  templateUrl: './attendance-setup-tab.component.html',
  styleUrl: './attendance-setup-tab.component.scss',
})
export class AttendanceSetupTabComponent {
  @Input() set initialData(v: AttendanceSetupData) {
    const { workDayStart, workDayEnd, ...rest } = v;
    Object.assign(this, rest);
    if (workDayStart) {
      const [h, m] = workDayStart.split(':');
      this.startHour = h ?? '09'; this.startMinute = m ?? '00';
    }
    if (workDayEnd) {
      const [h, m] = workDayEnd.split(':');
      this.endHour = h ?? '18'; this.endMinute = m ?? '00';
    }
  }
  @Output() dataChange = new EventEmitter<AttendanceSetupData>();

  clockInMethods: string[] = [];
  workWeekStart = 'Monday';
  workWeekEnd   = 'Friday';
  startHour     = '09';
  startMinute   = '00';
  endHour       = '18';
  endMinute     = '00';

  readonly hours = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
  readonly minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  gracePeriod       = '10 mins';
  customGrace       = '';
  showCustomGrace   = false;
  lateThreshold     = '';
  locationRule      = '';
  requirePhoto      = false;
  ipRestriction     = false;
  selfieVerification = false;

  readonly allClockInMethods = [
    { label: 'Web Clock-in',      icon: '🖥️' },
    { label: 'Mobile App',        icon: '📱' },
    { label: 'Biometric Device',  icon: '👆' },
    { label: 'Face Recognition',  icon: '🤳' },
    { label: 'QR Code Scan',      icon: '⬛' },
  ];

  readonly weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday',
  ];

  readonly gracePresets = ['None', '5 mins', '10 mins', '15 mins', '30 mins', 'Custom'];

  readonly lateThresholds = [
    'After 5 minutes', 'After 10 minutes', 'After 15 minutes',
    'After 30 minutes', 'After 1 hour',
  ];

  readonly locationRules = [
    'No Restriction', 'Office Only (GPS)', 'Geofenced Area',
    'IP Restricted (Office Network)',
  ];

  isMethodSelected(m: string): boolean {
    return this.clockInMethods.includes(m);
  }

  toggleMethod(m: string): void {
    if (this.isMethodSelected(m)) {
      this.clockInMethods = this.clockInMethods.filter(x => x !== m);
    } else {
      this.clockInMethods = [...this.clockInMethods, m];
    }
    this.emit();
  }

  setGrace(preset: string): void {
    if (preset === 'Custom') {
      this.showCustomGrace = true;
      this.gracePeriod = 'Custom';
    } else {
      this.showCustomGrace = false;
      this.gracePeriod = preset;
      this.customGrace = '';
    }
    this.emit();
  }

  get effectiveGrace(): string {
    if (this.showCustomGrace && this.customGrace) {
      return `${this.customGrace} mins`;
    }
    return this.gracePeriod;
  }

  get isValid(): boolean {
    return this.clockInMethods.length > 0 && !!this.locationRule;
  }

  getData(): AttendanceSetupData {
    return {
      clockInMethods:    this.clockInMethods,
      workWeekStart:     this.workWeekStart,
      workWeekEnd:       this.workWeekEnd,
      workDayStart:      `${this.startHour}:${this.startMinute}`,
      workDayEnd:        `${this.endHour}:${this.endMinute}`,
      gracePeriod:       this.effectiveGrace,
      lateThreshold:     this.lateThreshold,
      locationRule:      this.locationRule,
      requirePhoto:      this.requirePhoto,
      ipRestriction:     this.ipRestriction,
      selfieVerification: this.selfieVerification,
    };
  }

  emit(): void {
    this.dataChange.emit(this.getData());
  }

  toggle(field: 'requirePhoto' | 'ipRestriction' | 'selfieVerification'): void {
    this[field] = !this[field];
    this.emit();
  }
}
