import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {

  constructor(private router: Router) {}

  features = [
    {
      icon: '🕐',
      title: 'Smart Attendance',
      desc: 'GPS-aware clock-in/out, automatic late detection, real-time presence tracking across offices.',
    },
    {
      icon: '🏖️',
      title: 'Leave Management',
      desc: 'Custom leave policies, approval workflows, and balance tracking — all in one place.',
    },
    {
      icon: '👥',
      title: 'Employee Directory',
      desc: 'Org chart, profiles, departments, and role management with fine-grained permissions.',
    },
    {
      icon: '📊',
      title: 'Live Dashboard',
      desc: "Real-time headcount, attendance rings, leave requests, and org-wide activity at a glance.",
    },
    {
      icon: '🌍',
      title: 'Multi-Office Support',
      desc: 'Manage multiple locations with their own timezones, holidays, and attendance policies.',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      desc: 'Instant alerts for approvals, clock-in reminders, anniversaries, and custom events.',
    },
  ];

  stats = [
    { value: '10k+', label: 'Employees managed' },
    { value: '500+', label: 'Organizations' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '4.9 ★', label: 'Customer rating' },
  ];

  mobileMenuOpen = signal(false);
  toggleMenu(): void { this.mobileMenuOpen.update(v => !v); }
  closeMenu(): void  { this.mobileMenuOpen.set(false); }

  goLogin()     { this.closeMenu(); this.router.navigate(['/login']); }
  goRegister()  { this.closeMenu(); this.router.navigate(['/register']); }
  goTrial()     { this.closeMenu(); this.router.navigate(['/free-trial']); }
  goDemo()      { this.closeMenu(); this.router.navigate(['/free-trial'], { queryParams: { mode: 'demo' } }); }
  goDashboard() { this.closeMenu(); this.router.navigate(['/app/dashboard']); }
}
