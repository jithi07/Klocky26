import { Injectable, inject } from '@angular/core';
import { AppStateService } from './app-state.service';

// ─────────────────────────────────────────────────────────────────────────────
// TokenService — thin facade over AppStateService
//
// ⚠  DEPRECATED in favour of AppStateService (the single encrypted global state).
//    This file is kept for backwards-compatibility only.
//    New code should inject AppStateService directly.
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly appState = inject(AppStateService);

  getAccessToken(): string | null  { return this.appState.getAccessTokenSync(); }
  hasToken():       boolean        { return !!this.appState.getAccessTokenSync(); }
  isTokenExpired(): boolean        { return this.appState.isTokenExpired(); }
}

