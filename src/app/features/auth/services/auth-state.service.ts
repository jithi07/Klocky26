import { Injectable, signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';

export type AuthStep = 'org' | 'email' | 'otp';
export type RegisterStep = 'org-info' | 'admin-email' | 'otp' | 'profile';
export type UserRole = 'admin' | 'employee';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // ── Login flow ──────────────────────────────────────────────
  readonly orgIdentifier = signal('globex');
  readonly orgDisplayName = signal('');
  readonly email = signal('');
  readonly userRole = signal<UserRole>('employee');

  // ── Register flow ───────────────────────────────────────────
  readonly regOrgName = signal('');
  readonly regOrgSlug = signal('');
  readonly regAdminEmail = signal('');
  readonly regAdminName = signal('');

  // ── Derived ─────────────────────────────────────────────────
  readonly orgDomain = computed(() =>
    this.orgIdentifier().toLowerCase().replace(/\s+/g, '') || ''
  );

  constructor(private titleService: Title) {}

  setOrg(identifier: string, displayName?: string): void {
    this.orgIdentifier.set(identifier);
    const name = displayName ?? (identifier.charAt(0).toUpperCase() + identifier.slice(1));
    this.orgDisplayName.set(name);
    this.titleService.setTitle(`${name}.klock`);
  }

  setEmail(email: string): void {
    this.email.set(email);
  }

  resetLogin(): void {
    this.orgIdentifier.set('');
    this.orgDisplayName.set('');
    this.email.set('');
    this.titleService.setTitle('Klock');
  }

  resetToOrgStep(): void {
    this.email.set('');
    this.orgIdentifier.set('');
    this.orgDisplayName.set('');
    this.titleService.setTitle('Klock');
  }
}
