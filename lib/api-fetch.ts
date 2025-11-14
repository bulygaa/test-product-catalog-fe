import {
  IApiError,
  IApiResponse,
  IPaginatedResponse,
} from "@/shared-types/src/api-types";
import { headers } from "next/headers";

const BASE = process.env.PRODUCT_API_URL!;
const SEND_COOKIES = process.env.PRODUCT_API_SEND_COOKIES === "true";
const TIMEOUT_MS = Number(process.env.PRODUCT_API_TIMEOUT_MS ?? 10000);

if (!BASE) {
  throw new Error("Missing env: PRODUCT_API_URL");
}

type FetchInit = RequestInit & { timeoutMs?: number };

function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(
      () => reject(new Error(`Request timed out after ${ms}ms`)),
      ms
    );
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

export async function apiFetch<
  T extends IApiResponse | IPaginatedResponse<unknown>
>(path: string, init: FetchInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? TIMEOUT_MS;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "X-Requested-With": "next-server-action",
  };

  // If you need to forward auth cookies across origins and your CORS supports it:
  const credentialMode: RequestCredentials = SEND_COOKIES ? "include" : "omit";

  // Propagate a few safe headers if helpful (optional)
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for") ?? undefined;

  const req = fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init.headers || {}),
      ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
    },
    credentials: credentialMode,
    cache: "no-store", // hard no-store to prevent stale data
    signal: controller.signal,
  });

  try {
    const res = await withTimeout(req, timeoutMs);
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};

    if (!res.ok) {
      // Try to format backend error shape
      const err: IApiError = {
        error: json?.error || res.statusText || "Request failed",
        message: json?.message || json?.error || "Upstream error",
        statusCode: json?.statusCode || res.status,
        details: json?.details,
      };
      throw err;
    }

    // Success path; ensure "success: true"
    if (json?.success === false) {
      const err: IApiError = {
        error: json?.error || "Unknown error",
        message: json?.message || json?.error || "Request failed",
        statusCode: 500,
        details: json,
      };
      throw err;
    }

    return json as T;
  } catch (e: unknown) {
    if (typeof (e as { statusCode?: number }).statusCode === "number") throw e;

    const err: IApiError = {
      error: "NetworkError",
      message: e instanceof Error ? e.message : "Network/unknown error",
      statusCode: 0,
    };
    throw err;
  }
}
