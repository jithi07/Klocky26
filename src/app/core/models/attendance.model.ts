// ─────────────────────────────────────────────────────────────────────────────
// Attendance models — INTEGRATION_GUIDE.md §4
// ─────────────────────────────────────────────────────────────────────────────

import { ClockInMethod } from './user.model';

export type AttendanceStatus = 'present' | 'half' | 'absent' | 'leave' | 'holiday' | 'off';
export type AutoClockedOutReason = 'geofence_exit' | 'missed_ping' | null;

/** POST /api/attendance/clock-in request */
export interface ClockInRequest {
  method: ClockInMethod;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
}

/** POST /api/attendance/clock-out request — every field optional */
export interface ClockOutRequest {
  method?: ClockInMethod;
  latitude?: number;
  longitude?: number;
  photoUrl?: string | null;
}

/** Shared response shape for clock-in / clock-out / today */
export interface AttendanceRecordResponse {
  attendanceRecordId: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  clockInTime: string | null;
  clockOutTime: string | null;
  hoursWorked: number | null;
  clockInMethod: ClockInMethod | null;
  clockOutMethod: ClockInMethod | null;
  overtimeHours: number | null;
  autoClockedOutReason: AutoClockedOutReason;
  /** Non-null → this employee is geofence-restricted; start the ping timer at this interval */
  geofencePingIntervalMinutes: number | null;
}

/** POST /api/attendance/location-ping request */
export interface LocationPingRequest {
  latitude: number;
  longitude: number;
}

/** POST /api/attendance/location-ping response (data) */
export interface LocationPingResponse {
  attendanceRecordId: string;
  isWithinGeofence: boolean;
  distanceMeters: number;
  autoClockedOut: boolean;
  status: AttendanceRecordResponse;
}

/** GET /api/attendance/team response (data) item */
export interface TeamAttendanceItem {
  userId: string;
  fullName: string;
  departmentName: string | null;
  today: AttendanceRecordResponse | null;
}
