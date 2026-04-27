import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DeptStat {
  name: string;
  count: number;
  color: string;
}

interface LeaveRequest {
  name: string;
  initials: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface RecentActivity {
  type: 'join' | 'exit' | 'leave-approved' | 'leave-rejected' | 'leave-pending';
  name: string;
  initials: string;
  detail: string;
  time: string;
}

interface Announcement {
  title: string;
  body: string;
  date: string;
  tag: string;
  tagColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  constructor(private router: Router) {}

  today = new Date();

  greeting = computed(() => {
    const h = this.today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  org = { name: 'Klocky Inc.', admin: 'Riya Sharma', role: 'HR Manager', initials: 'RS' };

  stats = [
    { label: 'Total Employees', value: '148', sub: '+3 this month',     icon: 'people', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Present Today',   value: '121', sub: '81.7% attendance',  icon: 'check',  color: '#22c55e', bg: '#f0fdf4' },
    { label: 'On Leave Today',  value: '14',  sub: '9 approved',        icon: 'leaf',   color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Pending Requests',value: '7',   sub: 'Need your action',  icon: 'clock',  color: '#ef4444', bg: '#fef2f2' },
  ];

  attendance = { present: 121, late: 8, absent: 19, total: 148 };
  get presentPct() { return Math.round((this.attendance.present / this.attendance.total) * 100); }
  get latePct()    { return Math.round((this.attendance.late    / this.attendance.total) * 100); }
  get absentPct()  { return Math.round((this.attendance.absent  / this.attendance.total) * 100); }

  readonly circ = 263.9;
  get presentDash() { return (this.attendance.present / this.attendance.total) * this.circ; }
  get lateDash()    { return (this.attendance.late    / this.attendance.total) * this.circ; }
  get absentDash()  { return (this.attendance.absent  / this.attendance.total) * this.circ; }
  get lateOffset()  { return -this.presentDash; }
  get absentOffset(){ return -(this.presentDash + this.lateDash); }

  departments: DeptStat[] = [
    { name: 'Engineering', count: 52, color: '#6366f1' },
    { name: 'Design',      count: 18, color: '#ec4899' },
    { name: 'Marketing',   count: 24, color: '#f59e0b' },
    { name: 'Sales',       count: 30, color: '#22c55e' },
    { name: 'Operations',  count: 14, color: '#14b8a6' },
    { name: 'Finance',     count: 10, color: '#8b5cf6' },
  ];

  totalEmployees = 148;
  deptBarWidth(d: DeptStat) { return Math.round((d.count / this.totalEmployees) * 100); }

  leaveRequests: LeaveRequest[] = [
    { name: 'Arjun Mehta',  initials: 'AM', type: 'Casual Leave', from: 'May 2',  to: 'May 3',  days: 2, status: 'pending' },
    { name: 'Priya Nair',   initials: 'PN', type: 'Sick Leave',   from: 'Apr 28', to: 'Apr 28', days: 1, status: 'pending' },
    { name: 'Rohan Desai',  initials: 'RD', type: 'Earned Leave', from: 'May 5',  to: 'May 9',  days: 5, status: 'pending' },
    { name: 'Sneha Kapoor', initials: 'SK', type: 'Casual Leave', from: 'May 1',  to: 'May 1',  days: 1, status: 'pending' },
    { name: 'Vivek Sharma', initials: 'VS', type: 'Comp Off',     from: 'Apr 29', to: 'Apr 29', days: 1, status: 'pending' },
  ];

  activities: RecentActivity[] = [
    { type: 'join',           name: 'Kavya Iyer',    initials: 'KI', detail: 'Joined · Design',         time: 'Today'     },
    { type: 'leave-approved', name: 'Arjun Mehta',   initials: 'AM', detail: 'Leave approved · 2 days', time: 'Today'     },
    { type: 'leave-pending',  name: 'Priya Nair',    initials: 'PN', detail: 'Sick leave · 1 day',      time: 'Yesterday' },
    { type: 'exit',           name: 'Rahul Tiwari',  initials: 'RT', detail: 'Last working day',        time: 'Apr 25'    },
    { type: 'leave-rejected', name: 'Meera Joshi',   initials: 'MJ', detail: 'Leave rejected',          time: 'Apr 24'    },
    { type: 'join',           name: 'Siddharth Rao', initials: 'SR', detail: 'Joined · Engineering',    time: 'Apr 22'    },
  ];

  upcomingHolidays = [
    { name: 'Labour Day',       date: 'May 1, Thu',  daysLeft: 4   },
    { name: 'Eid al-Adha',      date: 'Jun 7, Sat',  daysLeft: 41  },
    { name: 'Independence Day', date: 'Aug 15, Sat', daysLeft: 110 },
  ];

  announcements: Announcement[] = [
    { title: 'Q2 All-Hands Meeting', body: 'Join us on May 5th for the company-wide Q2 all-hands. Calendar invite sent.', date: 'Apr 26', tag: 'Event',   tagColor: '#6366f1' },
    { title: 'New WFH Policy',       body: 'Updated work-from-home guidelines effective May 1st. Review the HR portal.',  date: 'Apr 22', tag: 'Policy',  tagColor: '#f59e0b' },
    { title: 'Holiday: Labour Day',  body: 'May 1st is a national holiday. All offices will be closed.',                  date: 'Apr 20', tag: 'Holiday', tagColor: '#22c55e' },
  ];

  quickActions = [
    { label: 'Add Employee',   icon: '➕', accent: '#6366f1' },
    { label: 'Approve Leaves', icon: '✅', accent: '#22c55e' },
    { label: 'Run Payroll',    icon: '💳', accent: '#f59e0b' },
    { label: 'Send Notice',    icon: '📢', accent: '#ec4899' },
  ];

  activityColor: Record<RecentActivity['type'], string> = {
    'join':           '#22c55e',
    'exit':           '#ef4444',
    'leave-approved': '#6366f1',
    'leave-rejected': '#ef4444',
    'leave-pending':  '#f59e0b',
  };

  goLanding() { this.router.navigate(['/']); }
}
