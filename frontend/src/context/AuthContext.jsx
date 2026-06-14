import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "../api/client";
import { fetchCurrentUser, login as loginRequest } from "../api/auth";
import { AUTH_EXPIRED_EVENT } from "../utils/authEvents";

const USER_KEY = "user";

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((accessToken, userData) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      clearSession();
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchCurrentUser();
        if (!cancelled) {
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          setUser(userData);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  const login = useCallback(
    async (email, password) => {
      const { access_token } = await loginRequest({ email, password });

      try {
        localStorage.setItem(TOKEN_KEY, access_token);
        setToken(access_token);

        const userData = await fetchCurrentUser();
        persistSession(access_token, userData);
        return userData;
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    [persistSession, clearSession],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateUser = useCallback((userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      updateUser,
    }),
    [token, user, loading, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
