// ─────────────────────────────────────────────────────────────────────────────
// Production environment configuration
// This file is swapped in at build time via angular.json fileReplacements.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  production: true,

  /** Production API base URL. Override via CI/CD env var → fileReplacement. */
  apiBaseUrl: 'https://api.klocky.app/v1',

  enableApiLogging: false,

  tokenKey: 'klocky_access_token',
  refreshTokenKey: 'klocky_refresh_token',
};
