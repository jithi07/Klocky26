import { HttpInterceptorFn } from '@angular/common/http';
import { inject }            from '@angular/core';
import { finalize }          from 'rxjs';
import { LoadingService }    from '../services/loading.service';
import { environment } from '../../../environments/environment';

// ─────────────────────────────────────────────────────────────────────────────
// Loading Interceptor
//
// Notifies LoadingService about each in-flight HTTP request.
// Components can inject LoadingService and read `isLoading()` to show a
// global spinner or skeleton.
//
// Usage in a component:
//   private loading = inject(LoadingService);
//   // template: @if (loading.isLoading()) { <klocky-ui-loader /> }
//
// Requests that should not trigger the global loader can be opted out by
// adding a custom header:
//   this.api.get('/silent-endpoint', {}, { headers: { 'X-Skip-Loader': '1' } })
// ─────────────────────────────────────────────────────────────────────────────

const SKIP_HEADER = 'X-Skip-Loader';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading  = inject(LoadingService);
  const skipLoader = req.headers.has(SKIP_HEADER);

  if (skipLoader) {
    // Strip the header before forwarding — it's only for the interceptor
    return next(req.clone({ headers: req.headers.delete(SKIP_HEADER) }));
  }

  loading.increment();

  if (environment.enableApiLogging) {
    console.debug(`[API] ▶ ${req.method} ${req.url}`);
  }

  const started = Date.now();

  return next(req).pipe(
    finalize(() => {
      loading.decrement();

      if (environment.enableApiLogging) {
        const elapsed = Date.now() - started;
        console.debug(`[API] ■ ${req.method} ${req.url} (${elapsed}ms)`);
      }
    }),
  );
};
