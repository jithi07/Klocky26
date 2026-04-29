import { Injectable, inject, signal, computed } from '@angular/core';
import { CryptoService }              from './crypto.service';
import { AppState, DEFAULT_APP_STATE } from '../models/app-state.model';
import { User }                        from '../models/user.model';
import { LoginResponse }               from '../models/user.model';

// ─────────────────────────────────────────────────────────────────────────────
// AppStateService — Single encrypted global state
//
// Architecture:
//  • All auth/session data lives under ONE localStorage key (`klocky_s`)
//  • The blob is AES-256-GCM encrypted by CryptoService before storage
//  • Signals expose reactive slices to templates and services
//  • `init()` must be called via APP_INITIALIZER before the app renders
//
// Usage:
//   private appState = inject(AppStateService);
//   this.appState.user()           // current user signal
//   this.appState.isAuthenticated() // computed boolean
//   await this.appState.setSession(loginResponse);
//   await this.appState.clearState();
// ─────────────────────────────────────────────────────────────────────────────

/** Single localStorage key — short and opaque */
const STATE_KEY = 'klocky_s';

@Injectable({ providedIn: 'root' })
export class AppStateService {

  private readonly crypto = inject(CryptoService);

  // ── Internal full-state signal ────────────────────────────────────────────
  private readonly _state = signal<AppState>({ ...DEFAULT_APP_STATE });

  // ── Public reactive slices ────────────────────────────────────────────────

  /** Currently authenticated user (null = logged out) */
  readonly user         = computed(() => this._state().user);

  /** Raw JWT access token */
  readonly accessToken  = computed(() => this._state().accessToken);

  /** Raw JWT refresh token */
  readonly refreshToken = computed(() => this._state().refreshToken);

  /** Active org slug */
  readonly orgSlug      = computed(() => this._state().orgSlug);

  /** True when a non-expired access token is present */
  readonly isAuthenticated = computed(() => {
    const s = this._state();
    if (!s.accessToken) return false;
    if (s.expiresAt && Date.now() >= s.expiresAt) return false;
    return true;
  });

  /** User's role (convenience shorthand) */
  readonly userRole = computed(() => this._state().user?.role ?? null);

  // ── Initialisation (called by APP_INITIALIZER) ────────────────────────────

  /**
   * Loads and decrypts persisted state from localStorage.
   * Must be called at startup before any guard or service reads state.
   * Wired in `app.config.ts` via APP_INITIALIZER.
   */
  async init(): Promise<void> {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;

      const decrypted = await this.crypto.decrypt<AppState>(raw);
      if (decrypted) {
        this._state.set({ ...DEFAULT_APP_STATE, ...decrypted });
      } else {
        // Corrupt / tampered storage — wipe it
        localStorage.removeItem(STATE_KEY);
      }
    } catch {
      localStorage.removeItem(STATE_KEY);
    }
  }

  // ── Write operations ──────────────────────────────────────────────────────

  /**
   * Persists login response into encrypted state.
   * Call this immediately after a successful /auth/login API response.
   */
  async setSession(response: LoginResponse): Promise<void> {
    const patch: AppState = {
      user:         response.user,
      accessToken:  response.accessToken,
      refreshToken: response.refreshToken,
      orgSlug:      response.user.orgSlug,
      expiresAt:    Date.now() + response.expiresIn * 1000,
    };
    await this._persist(patch);
  }

  /**
   * Updates the access token after a token refresh.
   */
  async refreshSession(accessToken: string, expiresIn: number): Promise<void> {
    await this._persist({
      ...this._state(),
      accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
    });
  }

  /**
   * Merges an arbitrary partial state patch and persists.
   * Prefer typed helpers (setSession, refreshSession, clearState) over this.
   */
  async patch(partial: Partial<AppState>): Promise<void> {
    await this._persist({ ...this._state(), ...partial });
  }

  /**
   * Clears all state and removes the localStorage entry.
   * Call on logout.
   */
  async clearState(): Promise<void> {
    this._state.set({ ...DEFAULT_APP_STATE });
    try { localStorage.removeItem(STATE_KEY); } catch { /* ignore */ }
  }

  // ── Convenience getters (sync — for interceptors / guards) ────────────────

  /** Sync access token read — use when async is not possible (e.g. interceptors) */
  getAccessTokenSync(): string | null {
    return this._state().accessToken;
  }

  /** Returns true if the current access token is expired */
  isTokenExpired(): boolean {
    const { expiresAt } = this._state();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private async _persist(state: AppState): Promise<void> {
    this._state.set(state);
    try {
      const encrypted = await this.crypto.encrypt(state);
      localStorage.setItem(STATE_KEY, encrypted);
    } catch {
      // Crypto failure (e.g. private mode, quota exceeded) — keep in-memory state only
    }
  }
}
