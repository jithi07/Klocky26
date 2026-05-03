import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_EMPLOYEES } from '../../../employees/models/employee.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent {
  // In a real app, load the current user from AppStateService
  readonly me = MOCK_EMPLOYEES[0]; // Riya Sharma – Admin/HR

  activeTab   = signal<'profile' | 'security' | 'preferences'>('profile');
  editMode    = signal(false);
  saved       = signal(false);
  pwSaved     = signal(false);

  // Editable profile fields
  phone       = signal(this.me.phone);
  officeLocation = signal(this.me.officeLocation);

  // Preferences
  theme         = signal<'light' | 'dark' | 'system'>('light');
  language      = signal('en');
  notifyEmail   = signal(true);
  notifyPush    = signal(true);
  notifySms     = signal(false);

  // Security
  currentPw   = signal('');
  newPw       = signal('');
  confirmPw   = signal('');
  pwError     = signal('');
  showPw      = signal(false);

  saveProfile() {
    this.saved.set(true);
    this.editMode.set(false);
    setTimeout(() => this.saved.set(false), 2000);
  }

  savePassword() {
    this.pwError.set('');
    if (!this.currentPw()) { this.pwError.set('Current password is required'); return; }
    if (this.newPw().length < 8) { this.pwError.set('New password must be at least 8 characters'); return; }
    if (this.newPw() !== this.confirmPw()) { this.pwError.set('Passwords do not match'); return; }
    this.pwSaved.set(true);
    this.currentPw.set(''); this.newPw.set(''); this.confirmPw.set('');
    setTimeout(() => this.pwSaved.set(false), 2500);
  }

  pwHasUpper()   { return /[A-Z]/.test(this.newPw()); }
  pwHasNumber()  { return /[0-9]/.test(this.newPw()); }
  pwHasSpecial() { return /[^A-Za-z0-9]/.test(this.newPw()); }

  readonly recentActivity = [
    { action: 'Approved leave request',    time: '2 hours ago',  icon: '✅' },
    { action: 'Added employee Sakshi M',   time: '1 day ago',    icon: '👤' },
    { action: 'Sent Q2 performance review',time: '3 days ago',   icon: '📊' },
    { action: 'Updated attendance policy', time: '5 days ago',   icon: '⚙️' },
    { action: 'Generated payroll report',  time: '1 week ago',   icon: '📄' },
  ];
}
