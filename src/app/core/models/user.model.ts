// ─────────────────────────────────────────────────────────────────────────────
// User / Auth Models
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  orgId: string;
  orgSlug: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  orgSlug: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  /** Access token expiry in seconds */
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}
