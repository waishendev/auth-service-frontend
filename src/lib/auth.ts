const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
  process.env.AUTH_SERVICE_URL ||
  "http://localhost:8010";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_COOKIE_NAME =
  process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ||
  process.env.JWT_COOKIE_NAME ||
  "access_token";
const DEFAULT_TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours

type LoginPayload = {
  login: string;
  password: string;
};

type AuthSuccessResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  [key: string]: unknown;
};

type ErrorResponse = {
  error?: string;
  message?: string;
};

function isAuthSuccessResponse(value: unknown): value is AuthSuccessResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).access_token === "string"
  );
}

function getLocalStorage(): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}; path=/; max-age=${Math.max(
    0,
    Math.trunc(maxAge),
  )}; sameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; sameSite=Lax`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
}

function persistTokens({
  access_token,
  refresh_token,
  expires_in,
}: AuthSuccessResponse) {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(ACCESS_TOKEN_KEY, access_token);
    if (refresh_token) {
      storage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    } else {
      storage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  setCookie(ACCESS_COOKIE_NAME, access_token, expires_in ?? DEFAULT_TOKEN_MAX_AGE);
}

function clearTokens() {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
  deleteCookie(ACCESS_COOKIE_NAME);
}

function getStoredAccessToken(): string | undefined {
  const storage = getLocalStorage();
  const token = storage?.getItem(ACCESS_TOKEN_KEY) || readCookie(ACCESS_COOKIE_NAME);
  return token ?? undefined;
}

function getStoredRefreshToken(): string | undefined {
  const storage = getLocalStorage();
  const token = storage?.getItem(REFRESH_TOKEN_KEY);
  return token ?? undefined;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("Session expired");
  }

  const response = await fetch(`${AUTH_SERVICE_URL}/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok || !isAuthSuccessResponse(payload)) {
    clearTokens();
    const message =
      (payload as ErrorResponse)?.error ||
      (payload as ErrorResponse)?.message ||
      "Session expired";
    throw new Error(message);
  }

  persistTokens(payload);
  return payload.access_token;
}

export async function login(loginId: string, password: string) {
  const payload: LoginPayload = { login: loginId, password };
  const response = await fetch(`${AUTH_SERVICE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok || !isAuthSuccessResponse(data)) {
    const message =
      (data as ErrorResponse)?.error ||
      (data as ErrorResponse)?.message ||
      "Login failed";
    throw new Error(message);
  }

  persistTokens(data);
  return data;
}

export async function getMe<TProfile = unknown>(): Promise<TProfile> {
  let accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${AUTH_SERVICE_URL}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.ok) {
    return (await response.json()) as TProfile;
  }

  if (response.status === 401 || response.status === 403) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Session expired");
    }

    const retryResponse = await fetch(`${AUTH_SERVICE_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (retryResponse.ok) {
      return (await retryResponse.json()) as TProfile;
    }

    if (retryResponse.status === 401 || retryResponse.status === 403) {
      clearTokens();
      throw new Error("Unauthorized");
    }

    const retryError: unknown = await retryResponse.json().catch(() => ({}));
    const retryMessage =
      (retryError as ErrorResponse)?.error ||
      (retryError as ErrorResponse)?.message ||
      retryResponse.statusText ||
      "Failed to fetch profile";
    throw new Error(retryMessage);
  }

  const errorPayload: unknown = await response.json().catch(() => ({}));
  const message =
    (errorPayload as ErrorResponse)?.error ||
    (errorPayload as ErrorResponse)?.message ||
    response.statusText ||
    "Failed to fetch profile";
  throw new Error(message);
}

export async function logout() {
  const accessToken = getStoredAccessToken();
  try {
    if (accessToken) {
      await fetch(`${AUTH_SERVICE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } finally {
    clearTokens();
  }
}

export function getAccessToken() {
  return getStoredAccessToken();
}

export function getRefreshToken() {
  return getStoredRefreshToken();
}
