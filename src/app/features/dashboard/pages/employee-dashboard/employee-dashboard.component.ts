import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
}

interface Shift {
  day: string;
  date: number;
  start: string;
  end: string;
  isToday: boolean;
}

interface Activity {
  action: string;
  time: string;
  date: string;
  type: 'in' | 'out' | 'leave' | 'absent' | 'holiday';
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent {
  constructor(private router: Router) {}

  now = new Date();
  isClockedIn = signal(false);
  clockInTime = signal<string | null>(null);
  todayHours   = signal('0h 00m');

  private clockInDate: Date | null = null;
  private timerRef?: ReturnType<typeof setInterval>;

  toggleClock(): void {
    if (this.isClockedIn()) {
      // Clock out
      this.isClockedIn.set(false);
      if (this.timerRef) clearInterval(this.timerRef);
      this.clockInTime.set(null);
    } else {
      // Clock in
      this.clockInDate = new Date();
      this.clockInTime.set(this.formatTime(this.clockInDate));
      this.isClockedIn.set(true);
      this.timerRef = setInterval(() => {
        if (this.clockInDate) {
          const diff = Date.now() - this.clockInDate.getTime();
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          this.todayHours.set(`${h}h ${String(m).padStart(2, '0')}m`);
        }
      }, 10000);
    }
  }

  formatTime(d: Date): string {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  leaveBalances: LeaveBalance[] = [
    { type: 'Annual',      used: 5,  total: 18, color: '#6366f1' },
    { type: 'Sick',        used: 2,  total: 12, color: '#10b981' },
    { type: 'Casual',      used: 1,  total: 6,  color: '#f59e0b' },
    { type: 'Comp-off',    used: 0,  total: 3,  color: '#8b5cf6' },
  ];

  upcomingShifts: Shift[] = [
    { day: 'Mon', date: 28, start: '09:00', end: '18:00', isToday: false },
    { day: 'Tue', date: 29, start: '09:00', end: '18:00', isToday: false },
    { day: 'Wed', date: 30, start: '09:00', end: '18:00', isToday: false },
    { day: 'Thu', date: 1,  start: '09:00', end: '18:00', isToday: false },
    { day: 'Fri', date: 2,  start: '09:00', end: '18:00', isToday: false },
  ];

  recentActivity: Activity[] = [
    { action: 'Clocked In',   time: '09:02 AM', date: 'Today',     type: 'in'     },
    { action: 'Clocked Out',  time: '06:14 PM', date: 'Yesterday', type: 'out'    },
    { action: 'Clocked In',   time: '08:58 AM', date: 'Yesterday', type: 'in'     },
    { action: 'Leave Approved', time: '',       date: 'Apr 25',    type: 'leave'  },
    { action: 'Clocked Out',  time: '06:30 PM', date: 'Apr 24',    type: 'out'    },
  ];

  announcements = [
    { title: 'Public Holiday — May 1',   body: "Labour Day is an office holiday. Enjoy the long weekend!", date: 'Apr 26', tag: 'Holiday' },
    { title: 'Q2 Performance Reviews',   body: 'Self-assessments are due by May 5. Check your HR portal.', date: 'Apr 24', tag: 'HR' },
  ];

  activityColor(type: Activity['type']): string {
    const map: Record<Activity['type'], string> = {
      in: '#10b981', out: '#6366f1', leave: '#f59e0b', absent: '#ef4444', holiday: '#06b6d4',
    };
    return map[type];
  }

  leavePercent(b: LeaveBalance): number {
    return Math.round((b.used / b.total) * 100);
  }
}
