const ACCESS_TOKEN_KEY = "cong_access_token";
const REFRESH_TOKEN_KEY = "cong_refresh_token";
const STORAGE_MODE_KEY = "cong_storage_mode";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

type StorageMode = "local" | "session";

function getStorage(mode: StorageMode): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return mode === "local"
    ? window.localStorage
    : window.sessionStorage;
}

function getSavedMode(): StorageMode {
  if (typeof window === "undefined") {
    return "session";
  }

  return window.localStorage.getItem(STORAGE_MODE_KEY) === "local"
    ? "local"
    : "session";
}

export async function saveSession(
  session: AuthSession,
  persist?: boolean,
): Promise<void> {
  const shouldPersist =
    persist ?? getSavedMode() === "local";
  const mode: StorageMode = shouldPersist ? "local" : "session";
  const storage = getStorage(mode);

  if (!storage || typeof window === "undefined") {
    throw new Error("Armazenamento do navegador indisponível.");
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);

  storage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);

  if (shouldPersist) {
    window.localStorage.setItem(STORAGE_MODE_KEY, "local");
  } else {
    window.localStorage.removeItem(STORAGE_MODE_KEY);
  }
}

export async function getAccessToken(): Promise<string | null> {
  return getStorage(getSavedMode())?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  return getStorage(getSavedMode())?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export async function getSession(): Promise<AuthSession | null> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export async function clearSession(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(STORAGE_MODE_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
