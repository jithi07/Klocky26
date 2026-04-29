import { User } from './user.model';

// ─────────────────────────────────────────────────────────────────────────────
// AppState — the single shape stored (encrypted) in localStorage
// ─────────────────────────────────────────────────────────────────────────────
export interface AppState {
  /** Authenticated user profile */
  user: User | null;

  /** JWT access token — short-lived */
  accessToken: string | null;

  /** JWT refresh token — long-lived */
  refreshToken: string | null;

  /** Active org slug (drives theme + API routing) */
  orgSlug: string | null;

  /** Unix ms timestamp when the access token expires */
  expiresAt: number | null;
}

/** Default empty state (unauthenticated) */
export const DEFAULT_APP_STATE: AppState = {
  user:         null,
  accessToken:  null,
  refreshToken: null,
  orgSlug:      null,
  expiresAt:    null,
};
