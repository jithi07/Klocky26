import { Injectable, signal, computed } from '@angular/core';

// ─────────────────────────────────────────────────────────────────────────────
// LoadingService — tracks in-flight HTTP requests globally
//
// Usage in components:
//   private loading = inject(LoadingService);
//   // template: @if (loading.isLoading()) { <klocky-ui-loader /> }
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class LoadingService {

  /** Number of active HTTP requests */
  private _activeRequests = signal(0);

  /** True when at least one HTTP request is in flight */
  readonly isLoading = computed(() => this._activeRequests() > 0);

  /** Called by the loading interceptor before each request */
  increment(): void {
    this._activeRequests.update(n => n + 1);
  }

  /** Called by the loading interceptor after each response / error */
  decrement(): void {
    this._activeRequests.update(n => Math.max(0, n - 1));
  }

  /** Force-reset (e.g. after a navigation event) */
  reset(): void {
    this._activeRequests.set(0);
  }
}
