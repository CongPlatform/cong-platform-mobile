import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "cong_access_token";
const REFRESH_TOKEN_KEY = "cong_refresh_token";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

/*
 * Sessão temporária: usada quando o usuário não marca "Lembrar de mim".
 * Ela dura enquanto o aplicativo estiver aberto, mas não é restaurada
 * depois que o processo do app é encerrado.
 */
let transientSession: AuthSession | null = null;
let persistentSession = false;

export async function saveSession(
  session: AuthSession,
  persist?: boolean,
): Promise<void> {
  const shouldPersist = persist ?? persistentSession;

  transientSession = session;
  persistentSession = shouldPersist;

  if (!shouldPersist) {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      session.accessToken,
    ),
    SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      session.refreshToken,
    ),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  if (transientSession?.accessToken) {
    return transientSession.accessToken;
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  if (transientSession?.refreshToken) {
    return transientSession.refreshToken;
  }

  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getSession(): Promise<AuthSession | null> {
  if (transientSession) {
    return transientSession;
  }

  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  transientSession = {
    accessToken,
    refreshToken,
  };
  persistentSession = true;

  return transientSession;
}

export async function clearSession(): Promise<void> {
  transientSession = null;
  persistentSession = false;

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
