// ─────────────────────────────────────────────────────────────────────────────
// API Response Models
//
// All API responses from the Klocky backend follow a standard envelope.
// Use these types instead of `any` when consuming API data.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard success envelope returned by all Klocky API endpoints.
 *
 * @example
 * // GET /employees
 * // { success: true, data: [...], message: 'OK', meta: { total: 42, page: 1 } }
 * this.api.get<ApiResponse<Employee[]>>('/employees').subscribe(res => res.data)
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  /** Present on list endpoints */
  meta?: PaginationMeta;
}

/** Pagination metadata returned on paginated list endpoints */
export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Standard error envelope. The error interceptor maps HTTP errors into this shape.
 */
export interface ApiError {
  success: false;
  message: string;
  /** Machine-readable error code e.g. "INVALID_CREDENTIALS", "TOKEN_EXPIRED" */
  code?: string;
  /** Field-level validation errors */
  errors?: Record<string, string[]>;
  statusCode: number;
}

/** Query params for paginated list endpoints */
export interface PaginationParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
