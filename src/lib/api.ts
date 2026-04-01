/* ══════════════════════════════════════════════════ */
/* ── API Service Layer ── */
/* ══════════════════════════════════════════════════ */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/* ── Types ── */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  /** Used-in list for EXISTING_USED errors */
  usedIn?: string[];
  /** Pagination metadata */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}

/* ── Core fetch wrapper ── */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // TODO: Add auth token from session/cookie
  // const token = getAuthToken();
  // if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null as T,
        message: errorBody.message || `HTTP ${response.status}`,
        error: errorBody.error || "UNKNOWN_ERROR",
        usedIn: errorBody.usedIn,
      };
    }

    const json = await response.json();
    return {
      success: true,
      data: json.data ?? json,
      message: json.message,
      pagination: json.pagination,
    };
  } catch (err) {
    return {
      success: false,
      data: null as T,
      message: err instanceof Error ? err.message : "Network error",
      error: "NETWORK_ERROR",
    };
  }
}

/* ── HTTP Method Helpers ── */
export function get<T>(endpoint: string, params?: PaginationParams): Promise<ApiResponse<T>> {
  const query = params ? "?" + new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString() : "";
  return request<T>(`${endpoint}${query}`);
}

export function post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "POST", body: JSON.stringify(body) });
}

export function put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) });
}

export function patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) });
}

export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "DELETE" });
}

/* ── Convenience: check for EXISTING_USED error ── */
export function isExistingUsedError(response: ApiResponse): boolean {
  return !response.success && (response.error === "EXISTING_USED" || response.message === "EXISTING_USED");
}

/* ── Export as named api object ── */
const api = { get, post, put, patch, del, isExistingUsedError };
export default api;
