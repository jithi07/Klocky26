import { Injectable, signal, computed } from '@angular/core';
import { PlatformLoginResponse } from '../models/platform-auth.model';

// ─────────────────────────────────────────────────────────────────────────────
// PlatformAdminStateService — Klocky's own internal team session
//
// Completely separate identity from org employees/org-admins (no org, no
// tenant). Stored under its own localStorage key, plaintext is fine here
// (mirrors AppStateService's shape but doesn't warrant the same encryption
// machinery for an internal-only tool) — kept simple on purpose.
// ─────────────────────────────────────────────────────────────────────────────

interface PlatformAdminState {
  token: string | null;
  email: string | null;
  fullName: string | null;
  expiresAt: number | null;
}

const DEFAULT_STATE: PlatformAdminState = { token: null, email: null, fullName: null, expiresAt: null };
const STORAGE_KEY = 'klocky_platform_admin';

@Injectable({ providedIn: 'root' })
export class PlatformAdminStateService {

  private readonly _state = signal<PlatformAdminState>(this._restore());

  readonly token    = computed(() => this._state().token);
  readonly email    = computed(() => this._state().email);
  readonly fullName = computed(() => this._state().fullName);

  readonly isAuthenticated = computed(() => {
    const s = this._state();
    if (!s.token) return false;
    if (s.expiresAt && Date.now() >= s.expiresAt) return false;
    return true;
  });

  setSession(response: PlatformLoginResponse): void {
    this._persist({
      token: response.accessToken,
      email: response.email,
      fullName: response.fullName,
      expiresAt: new Date(response.expiresAt).getTime(),
    });
  }

  clearSession(): void {
    this._persist({ ...DEFAULT_STATE });
  }

  getTokenSync(): string | null {
    return this._state().token;
  }

  private _restore(): PlatformAdminState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  private _persist(state: PlatformAdminState): void {
    this._state.set(state);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }
}
