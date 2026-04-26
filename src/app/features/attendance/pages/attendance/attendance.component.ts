import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AttendanceCalendarComponent } from '../../components/attendance-calendar/attendance-calendar.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [AttendanceCalendarComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceComponent {}
