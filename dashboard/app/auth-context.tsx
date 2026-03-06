"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "teacher-experience-auth";
const PASSWORD = "teachersrule";

interface AuthContextValue {
  isAuthenticated: boolean | null;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      setIsAuthenticated(stored === "1");
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === PASSWORD) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, "1");
        setIsAuthenticated(true);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
