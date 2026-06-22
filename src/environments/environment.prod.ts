// ─────────────────────────────────────────────────────────────────────────────
// Production environment configuration
// This file is swapped in at build time via angular.json fileReplacements.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  production: true,

  /** Production API base URL. Override via CI/CD env var → fileReplacement. */
  apiBaseUrl: 'https://klock-api.onrender.com/api',

  /** SignalR notifications hub — same host as the API, root path (not under /api). */
  realtimeHubUrl: 'https://klock-api.onrender.com/hubs/notifications',

  enableApiLogging: false,

  /** Enable encryption in production for security */
  disableEncryption: false,

  tokenKey: 'klocky_access_token',
  refreshTokenKey: 'klocky_refresh_token',
};
