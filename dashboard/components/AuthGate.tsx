"use client";

import React from "react";
import { useAuth } from "@/app/auth-context";
import { LoginForm } from "@/components/LoginForm";
import { AppShell } from "@/components/AppShell";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eaeef2",
          fontSize: 14,
          color: "#57606a",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AppShell>{children}</AppShell>;
}
