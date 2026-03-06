"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/auth-context";

export function LoginForm() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(password)) {
      setPassword("");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eaeef2",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #d0d7de",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            margin: "0 0 24px 0",
            fontSize: 20,
            fontWeight: 600,
            color: "#24292f",
            textAlign: "center",
          }}
        >
          Teacher Experience
        </h1>
        <label
          htmlFor="password"
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "#24292f",
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            fontSize: 14,
            border: "1px solid #d0d7de",
            borderRadius: 6,
            marginBottom: error ? 8 : 16,
          }}
        />
        {error && (
          <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#cf222e" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "#24292f",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}
