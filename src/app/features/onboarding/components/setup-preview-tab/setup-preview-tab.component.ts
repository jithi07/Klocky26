import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { OrgSetupData } from '../org-setup-tab/org-setup-tab.component';
import { AttendanceSetupData } from '../attendance-setup-tab/attendance-setup-tab.component';

@Component({
  selector: 'ob-setup-preview-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './setup-preview-tab.component.html',
  styleUrl: './setup-preview-tab.component.scss',
})
export class SetupPreviewTabComponent {
  @Input() orgData!: OrgSetupData;
  @Input() attendanceData!: AttendanceSetupData;
  @Input() adminEmail = '';
}
