// ─────────────────────────────────────────────────────────────────────────────
// Org registration & org-admin auth models — INTEGRATION_GUIDE.md §1, §2
// ─────────────────────────────────────────────────────────────────────────────

import { ClockInMethod, UserRole } from './user.model';

/** POST /api/org/register/send-otp request */
export interface SendOtpRequest {
  organisationName: string;
  email: string;
}

/** POST /api/org/register/verify-otp request */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/** POST /api/org/register/verify-otp response (data) */
export interface VerifyOtpResponse {
  isVerified: boolean;
  verificationToken: string;
  expiresAt: string;
  message: string;
}

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
export type CheckInRuleType = 'none' | '5' | '10' | '15' | '30' | 'custom';
export type LocationPolicy = 'no_restrictions' | 'office_only' | 'geo_fenced_area' | 'ip_restriction';

/** POST /api/org/auth/register request */
export interface RegisterOrgRequest {
  verificationToken: string;
  organisationName: string;
  displayName: string;
  primaryEmail: string;
  industry: string;
  companySize: CompanySize;
  country: string;
  defaultTimezone: string;
  emailDomain?: string;
  website?: string;

  clockInMethods: ClockInMethod[];
  weekStartDay: string;
  weekEndDay: string;
  workHours: number;
  checkInRuleType: CheckInRuleType;
  checkInCustomMinutes?: number | null;
  halfDayThresholdHrs: number;
  lateThresholdMins: number;
  locationPolicy: LocationPolicy;
  overtimeEnabled: boolean;
  requirePhotoOnClockIn: boolean;
  ipRestrictionEnabled: boolean;
  selfieVerificationEnabled: boolean;
  autoCheckoutEnabled: boolean;
  currency: string;
}

/** POST /api/org/auth/register response (data) — also returned by org-admin login (2.1) */
export interface OrgLoginResponse {
  accessToken: string;
  orgSlug: string;
  role: UserRole;
  expiresAt: string;
  mustChangePassword: boolean;
  /** Only present on the initial registration response, shown exactly once */
  temporaryPassword?: string;
}

/** GET /api/org/auth/validate-slug/{slug} response (data) */
export interface ValidateSlugResponse {
  isValid: boolean;
  orgSlug: string;
  companyName: string;
}

/** PUT /api/tenant/register-complete request — org-wide attendance/policy defaults */
export interface RegisterCompleteRequest {
  companyName: string;
  displayName: string;
  primaryEmail: string;
  industry: string;
  companySize: CompanySize;
  country: string;
  defaultTimezone: string;
  clockInMethods: ClockInMethod[];
  weekStartDay: string;
  weekEndDay: string;
  workHours: number;
  checkInRuleType: CheckInRuleType;
  halfDayThresholdHrs: number;
  locationPolicy: LocationPolicy;

  overtimeEnabled: boolean;
  overtimeAfterHrs?: number;

  autoCheckoutEnabled: boolean;
  autoCheckoutTime?: string;

  geoFencingEnabled: boolean;
  geofencePingIntervalMinutes: number;
  geofenceMissedPingGraceMinutes: number;
}

/** GET /api/tenant/options response (data) — dropdown option lists */
export interface TenantOptionsResponse {
  clockInMethods: string[];
  countries: string[];
  timezones: string[];
  [key: string]: string[];
}

/** POST /api/org/auth/login request */
export interface OrgLoginRequest {
  orgSlug: string;
  email: string;
  password: string;
}

/** GET/PUT /api/org/auth/details */
export interface OrgDetails {
  orgSlug: string;
  companyName: string;
  legalName: string;
  industry: string;
  about: string;
  website: string;
  primaryEmail: string;
  phone: string;
  accentColor: string;
  isActive: boolean;
  createdAt: string;
}

/** PUT /api/org/auth/details request — every field optional except companyName */
export interface UpdateOrgDetailsRequest {
  companyName: string;
  legalName?: string;
  industry?: string;
  website?: string;
  about?: string;
  phone?: string;
  accentColor?: string;
}
