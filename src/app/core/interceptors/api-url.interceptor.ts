import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// ─────────────────────────────────────────────────────────────────────────────
// API URL Interceptor
//
// Automatically prepends `environment.apiBaseUrl` to every relative request.
// Absolute URLs (e.g. external CDN calls) are passed through unchanged.
//
// Example:
//   ApiService.get('/employees')
//   → GET https://api.klocky.app/v1/employees
// ─────────────────────────────────────────────────────────────────────────────

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip absolute URLs (external resources, assets, CDN, etc.)
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const base = environment.apiBaseUrl.replace(/\/$/, '');
  const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(req.clone({ url: `${base}${path}` }));
};
