import {
  getMyAccount,
  type AccountUser,
} from "@/services/accountService";
import {
  getCurrentUser,
  login,
  logout,
  register,
  type AuthUser,
  type LoginCredentials,
  type RegisterCredentials,
} from "@/services/authService";
import { ApiError } from "@/services/api";
import {
  clearSession,
  getSession,
} from "@/services/sessionStorage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SessionContextValue {
  user: AuthUser | null;
  account: AccountUser | null;
  loading: boolean;
  error: string | null;
  restore: (showLoading?: boolean) => Promise<AccountUser | null>;
  signIn: (credentials: LoginCredentials) => Promise<AccountUser>;
  signUp: (
    credentials: RegisterCredentials,
  ) => Promise<Pick<AuthUser, "id" | "name">>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restore = useCallback(
    async (showLoading = false): Promise<AccountUser | null> => {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      try {
        const session = await getSession();

        if (!session) {
          setUser(null);
          setAccount(null);
          return null;
        }

        const [currentUser, currentAccount] = await Promise.all([
          getCurrentUser(),
          getMyAccount(),
        ]);

        setUser(currentUser);
        setAccount(currentAccount);

        return currentAccount;
      } catch (cause) {
        if (cause instanceof ApiError && cause.status === 401) {
          await clearSession();
          setUser(null);
          setAccount(null);
        } else {
          setError(
            "Não foi possível carregar sua conta. Verifique a conexão e tente novamente.",
          );
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void restore(true);
  }, [restore]);
  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<AccountUser> => {
      const result = await login(credentials);
      setUser(result.user);

      const currentAccount = await getMyAccount();
      setAccount(currentAccount);
      setError(null);

      return currentAccount;
    },
    [],
  );
  const signUp = useCallback(
    async (
      credentials: RegisterCredentials,
    ): Promise<Pick<AuthUser, "id" | "name">> => {
      return register(credentials);
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await logout();
    } catch {
      // O logout local ainda ocorre quando o servidor está indisponível.
    } finally {
      setUser(null);
      setAccount(null);
      setError(null);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        account,
        loading,
        error,
        restore,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      "useSession precisa estar dentro de SessionProvider",
    );
  }

  return context;
}
