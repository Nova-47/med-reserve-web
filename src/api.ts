// src/utils/api.ts
import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from "axios";
import Cookies from "js-cookie";
import type { Booking, CreateBookingReq, CreateBookingResp } from "../type";

// -------- Env & Base URL --------
const isDev =
  typeof import.meta !== "undefined"
    ? import.meta.env.DEV
    : process.env.NODE_ENV === "development";
const ENV_BASE =
  typeof import.meta !== "undefined"
    ? import.meta.env.VITE_API_BASE
    : undefined;

const API_BASE =
  ENV_BASE ??
  (isDev
    ? "http://127.0.0.1:8000/api/v1" // 개발 기본값
    : "https://your-prod-api.example.com/api"); // 운영 기본값

if (isDev && !ENV_BASE) {
  // 환경변수 미설정 시 개발 콘솔에만 경고
  console.warn(
    "[api] VITE_API_BASE가 설정되지 않아 기본값을 사용합니다:",
    API_BASE
  );
}

// -------- CSRF Helpers --------
// js-cookie 우선

function getCSRFFromCookie(name = "csrftoken"): string | undefined {
  // js-cookie 우선
  const v = Cookies.get?.(name);
  if (v) return v;

  // fallback: SSR 환경에서 document 없으면 undefined
  if (typeof document === "undefined") return undefined;

  // fallback: 정규식으로 직접 쿠키에서 추출
  const m = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[2]) : undefined;
}

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// -------- Axios Instance --------
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 세션 쿠키 포함
  timeout: 15000,
});

// -------- Interceptors --------
api.interceptors.request.use((config) => {
  const method = (config.method || "get").toUpperCase();
  // 기본 JSON 헤더 (타입 안전)
  const headers = (config.headers ?? {}) as AxiosRequestHeaders;
  headers["Accept"] = "application/json";
  headers["Content-Type"] = "application/json";

  // unsafe 메서드에만 CSRF 자동 첨부
  if (UNSAFE_METHODS.has(method)) {
    const csrf = getCSRFFromCookie();
    if (csrf) {
      headers["X-CSRFToken"] = csrf;
    }
  }
  config.headers = headers;
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError<unknown>) => {
    // 401 공통 처리 (필요 시 라우팅/상태 초기화)
    if (err.response?.status === 401) {
      // window.location.assign("/login");
    }
    return Promise.reject(normalizeAxiosError(err));
  }
);

// -------- Error Normalizer --------
export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  raw?: unknown;
};

export function isApiError(e: unknown): e is ApiError {
  return typeof e === "object" && e !== null && "message" in e;
}

// type guard
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeAxiosError(err: AxiosError<unknown>): ApiError {
  const status = err.response?.status;
  const dataRaw = err.response?.data;
  // 백엔드 포맷 예: { ok:false, error:"TOKEN_EXPIRED", message?:string, detail?:string }
  const dataObj = isRecord(dataRaw) ? dataRaw : undefined;

  const code =
    (typeof dataObj?.error === "string" && dataObj.error) ||
    (typeof dataObj?.code === "string" && dataObj.code) ||
    undefined;
  const message =
    (typeof dataObj?.detail === "string" && dataObj.detail) ||
    (typeof dataObj?.message === "string" && dataObj.message) ||
    (code ? String(code) : err.message || "요청 처리 중 오류가 발생했습니다.");

  return { status, code, message, raw: dataObj ?? err };
}

// -------- Generic Wrappers --------
export async function get<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.get<T>(url, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.delete<T>(url, config);
  return res.data;
}

export async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.post<T>(url, body ?? {}, config);
  return res.data;
}

export async function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.put<T>(url, body ?? {}, config);
  return res.data;
}

export async function patch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.patch<T>(url, body ?? {}, config);
  return res.data;
}

// -------- Auth Module (Magic Link) --------
export type RequestMagicResp = {
  ok: true;
  message: string;
  demo_token?: string | null; // DEBUG일 때만
  expires_in_minutes: number;
};

export type VerifyResp = {
  ok: true;
  user: { email: string; name: string };
};

export const AuthAPI = {
  requestMagic(email: string) {
    return post<RequestMagicResp, { email: string }>(
      "/accounts/magic/request/",
      { email }
    );
  },
  verifyMagic(token: string) {
    return post<VerifyResp, { token: string }>("/accounts/magic/verify/", {
      token,
    });
  },
  me() {
    return get<{ email: string; name: string }>("/accounts/me/");
  },
  logout() {
    return post<{ ok: true }>("/accounts/logout/", {});
  },
};

export const BookingsAPI = {
  listMine() {
    return get<Booking[]>("/bookings/?mine=1");
  },
  requestCancel(id: string, reason?: string) {
    return post<{ ok: true }>("/bookings/cancel/", { id, reason });
  },
  requestModify(payload: { bookingId: string; note: string }) {
    return post<{ ok: true }>("/bookings/modify-request/", payload);
  },
  create(payload: CreateBookingReq) {
    //  타입은 ../type 에서 import한 걸 사용
    return post<CreateBookingResp, CreateBookingReq>("/bookings/", payload);
  },
};
