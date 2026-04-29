import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginationParams } from '../models/api-response.model';

// ─────────────────────────────────────────────────────────────────────────────
// ApiService — generic HTTP wrapper
//
// WHY this exists:
//  • Never call HttpClient.get/post directly in feature services.
//  • All requests go through this service so interceptors (auth, error,
//    loading, base-url) apply automatically and consistently.
//  • Returns typed Observables — no `any`.
//
// Usage in a domain service:
//   private api = inject(ApiService);
//
//   getEmployees(params?: PaginationParams) {
//     return this.api.get<ApiResponse<Employee[]>>('/employees', params);
//   }
//
//   createEmployee(payload: CreateEmployeeDto) {
//     return this.api.post<ApiResponse<Employee>>('/employees', payload);
//   }
//
// The api-url interceptor prepends `environment.apiBaseUrl` automatically,
// so pass only the path portion here (e.g. '/employees', NOT the full URL).
// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ApiService {

  private readonly http = inject(HttpClient);

  // ── GET ───────────────────────────────────────────────────────────────────

  /**
   * @param path   API path, e.g. '/employees' or '/employees/123'
   * @param params Optional query params (pagination, filters, search)
   */
  get<T>(path: string, params?: PaginationParams | Record<string, unknown>): Observable<T> {
    return this.http.get<T>(path, { params: this._buildParams(params) });
  }

  // ── POST ──────────────────────────────────────────────────────────────────

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(path, body);
  }

  // ── PUT ───────────────────────────────────────────────────────────────────

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(path, body);
  }

  // ── PATCH ─────────────────────────────────────────────────────────────────

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(path, body);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(path);
  }

  // ── File Upload ───────────────────────────────────────────────────────────

  /**
   * Upload a file as multipart/form-data.
   * @param path    API path
   * @param file    The file to upload
   * @param field   Form field name (default: 'file')
   * @param extra   Additional form fields to include
   */
  upload<T>(
    path: string,
    file: File,
    field = 'file',
    extra?: Record<string, string>,
  ): Observable<T> {
    const form = new FormData();
    form.append(field, file, file.name);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => form.append(k, v));
    }
    return this.http.post<T>(path, form);
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _buildParams(
    params?: PaginationParams | Record<string, unknown>,
  ): HttpParams {
    if (!params) return new HttpParams();
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        p = p.set(k, String(v));
      }
    });
    return p;
  }
}
