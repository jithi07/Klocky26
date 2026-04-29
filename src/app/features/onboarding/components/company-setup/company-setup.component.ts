import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ViewChild, signal,
} from '@angular/core';
import { OrgSetupTabComponent, OrgSetupData } from '../org-setup-tab/org-setup-tab.component';
import { AttendanceSetupTabComponent, AttendanceSetupData } from '../attendance-setup-tab/attendance-setup-tab.component';
import { SetupPreviewTabComponent } from '../setup-preview-tab/setup-preview-tab.component';

type SetupTab = 'org' | 'attendance' | 'preview';

@Component({
  selector: 'ob-company-setup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrgSetupTabComponent, AttendanceSetupTabComponent, SetupPreviewTabComponent],
  templateUrl: './company-setup.component.html',
  styleUrl: './company-setup.component.scss',
})
export class CompanySetupComponent {
  @Input() adminEmail = '';
  @Input() set orgName(name: string) {
    if (name) {
      this.orgData = { ...this.orgData, orgName: name, displayName: name };
    }
  }
  @Output() completed = new EventEmitter<{ org: OrgSetupData; attendance: AttendanceSetupData }>();

  @ViewChild(OrgSetupTabComponent)        orgTab!: OrgSetupTabComponent;
  @ViewChild(AttendanceSetupTabComponent) attTab!: AttendanceSetupTabComponent;

  activeTab = signal<SetupTab>('org');

  orgData: OrgSetupData = {
    orgName: '', displayName: '', emailDomain: '',
    industry: '', companySize: '', country: '', timezone: '', website: '',
  };

  attendanceData: AttendanceSetupData = {
    clockInMethods: [], workWeekStart: 'Monday', workWeekEnd: 'Friday',
    workDayStart: '09:00', workDayEnd: '18:00',
    gracePeriod: '10 mins', lateThreshold: '', locationRule: '',
    requirePhoto: false, ipRestriction: false, selfieVerification: false,
  };

  readonly tabs: { id: SetupTab; label: string; num: number }[] = [
    { id: 'org',        label: 'Organisation', num: 1 },
    { id: 'attendance', label: 'Attendance',   num: 2 },
    { id: 'preview',    label: 'Preview',      num: 3 },
  ];

  isTabDone(id: SetupTab): boolean {
    const order: SetupTab[] = ['org', 'attendance', 'preview'];
    return order.indexOf(id) < order.indexOf(this.activeTab());
  }

  stepLabel(): string {
    const idx = this.tabs.findIndex(t => t.id === this.activeTab());
    return `Step ${idx + 1} of ${this.tabs.length}`;
  }

  canGoNext(): boolean {
    if (this.activeTab() === 'org')        return this.orgTab?.isValid ?? false;
    if (this.activeTab() === 'attendance') return this.attTab?.isValid ?? false;
    return true;
  }

  next(): void {
    if (this.activeTab() === 'org') {
      this.orgData = this.orgTab.getData();
      this.activeTab.set('attendance');
    } else if (this.activeTab() === 'attendance') {
      this.attendanceData = this.attTab.getData();
      this.activeTab.set('preview');
    }
  }

  back(): void {
    if (this.activeTab() === 'attendance') this.activeTab.set('org');
    if (this.activeTab() === 'preview')    this.activeTab.set('attendance');
  }

  complete(): void {
    this.completed.emit({ org: this.orgData, attendance: this.attendanceData });
  }
}
