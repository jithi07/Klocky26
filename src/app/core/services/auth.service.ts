import { Injectable, inject } from '@angular/core';
import { Observable, tap }            from 'rxjs';
import { ApiService }                 from './api.service';
import { AppStateService }            from './app-state.service';
import { ApiResponse }                from '../models/api-response.model';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
}  from '../models/user.model';

// ─────────────────────────────────────────────────────────────────────────────
// AuthService — authentication API integration
//
// Wraps all /auth/* endpoints and coordinates with AppStateService.
//
// Usage:
//   private authService = inject(AuthService);
//
//   this.authService.login({ email, password, orgSlug }).subscribe();
//   this.authService.logout().subscribe();
//   this.authService.refreshToken().subscribe();
// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly api      = inject(ApiService);
  private readonly appState = inject(AppStateService);

  // ── Login ─────────────────────────────────────────────────────────────────

  /**
   * POST /auth/login
   * On success, encrypts and persists user + tokens into AppStateService.
   */
  login(payload: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.api.post<ApiResponse<LoginResponse>>('/auth/login', payload).pipe(
      tap(async (res) => {
        if (res.success) {
          await this.appState.setSession(res.data);
        }
      }),
    );
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  /**
   * POST /auth/logout
   * Always clears local state regardless of API response.
   */
  logout(): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>('/auth/logout', {}).pipe(
      tap(async () => {
        await this.appState.clearState();
      }),
    );
  }

  // ── Token Refresh ─────────────────────────────────────────────────────────

  /**
   * POST /auth/refresh
   * Called by the error interceptor on 401 responses.
   */
  refreshToken(): Observable<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = this.appState.refreshToken();
    const payload: RefreshTokenRequest = { refreshToken: refreshToken ?? '' };

    return this.api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', payload).pipe(
      tap(async (res) => {
        if (res.success) {
          await this.appState.refreshSession(res.data.accessToken, res.data.expiresIn);
        }
      }),
    );
  }

  // ── Forgot / Reset Password ───────────────────────────────────────────────

  /** POST /auth/forgot-password */
  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>('/auth/forgot-password', { email });
  }

  /** POST /auth/reset-password */
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
  }

  // ── Org Lookup ────────────────────────────────────────────────────────────

  /**
   * GET /orgs/:slug
   * Checks if an org workspace exists and returns its display info.
   */
  lookupOrg(slug: string): Observable<ApiResponse<{ name: string; logoUrl?: string; accentColor?: string }>> {
    return this.api.get(`/orgs/${slug}`);
  }
}
