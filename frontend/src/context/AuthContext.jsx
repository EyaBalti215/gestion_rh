import React, { createContext, useState } from 'react';

const AUTH_STORAGE_KEY = 'gestion-rh-auth';

export const AuthContext = createContext(null);

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const initialAuth = readStoredAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);

  const login = (userData) => {
    const nextToken = `session-${Date.now()}`;
    const nextAuth = { token: nextToken, user: userData };

    setToken(nextToken);
    setUser(userData);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: Boolean(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}