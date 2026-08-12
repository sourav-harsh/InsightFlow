import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { clearAuth, getStoredAuth, loginUser, registerUser, saveAuth } from "../api/client";

const AuthContext = createContext(null);

/**
 * Holds the signed-in session ({ token, user }).
 * The token is persisted in localStorage and attached to every API call
 * by src/api/client.js.
 */
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const login = useCallback(async (email, password) => {
    const session = await loginUser({ email, password });
    saveAuth(session);
    setAuth(session);
    return session;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const session = await registerUser({ name, email, password });
    saveAuth(session);
    setAuth(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      register,
      logout,
    }),
    [auth, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
