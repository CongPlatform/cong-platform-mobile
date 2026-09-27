import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "./sessionStorage";

// Configure no arquivo .env a URL pública do backend da CONG.
// Exemplo: EXPO_PUBLIC_API_URL=https://SEU-DOMINIO-HOSPEDADO
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  retryOnUnauthorized?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let refreshRequest: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new ApiError("Sessão expirada. Entre novamente.", 401);

    const response = await apiRequest<RefreshResponse>("/api/auth/refresh", {
      method: "POST",
      authenticated: false,
      retryOnUnauthorized: false,
      body: JSON.stringify({ refreshToken }),
    });
    await saveSession(response);
    return response.accessToken;
  })().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown = null
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getApiUrl(path: string): string {
  if (!API_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL não está configurada."
    );
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}

async function parseResponse(
  response: Response
): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return text || null;
}

function getErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    authenticated = true,
    retryOnUnauthorized = true,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (
    requestOptions.body &&
    !requestHeaders.has("Content-Type") &&
    !(requestOptions.body instanceof FormData)
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  if (authenticated) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new ApiError(
        "Sua sessão não está disponível. Entre novamente.",
        401
      );
    }

    requestHeaders.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      ...requestOptions,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor.",
      0
    );
  }

  if (response.status === 401 && authenticated && retryOnUnauthorized) {
    try {
      const renewedToken = await refreshAccessToken();
      requestHeaders.set("Authorization", `Bearer ${renewedToken}`);
      return apiRequest<T>(path, {
        ...requestOptions,
        headers: requestHeaders,
        authenticated: true,
        retryOnUnauthorized: false,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) throw error;
      await clearSession();
      throw new ApiError("Sessão expirada. Entre novamente.", 401);
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(
        data,
        `Erro na requisição (${response.status}).`
      ),
      response.status,
      data
    );
  }

  return data as T;
}
