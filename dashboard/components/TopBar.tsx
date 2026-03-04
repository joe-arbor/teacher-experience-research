"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard } from "lucide-react";

const TOP_BAR_HEIGHT = 56;
const APP_NAME = "Teacher Experience";

export function TopBar() {
  const [projectOpen, setProjectOpen] = useState(false);
  const [synced, setSynced] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setProjectOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header
      style={{
        height: TOP_BAR_HEIGHT,
        minHeight: TOP_BAR_HEIGHT,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#24292f",
        color: "#e6edf3",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden
        >
          <LayoutDashboard size={18} color="#e6edf3" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{APP_NAME}</span>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setProjectOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              color: "#e6edf3",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Teacher Experience PDS
            <ChevronDown size={16} style={{ opacity: 0.8 }} />
          </button>
          {projectOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 4,
                minWidth: 200,
                padding: 4,
                background: "#1c2128",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              <button
                type="button"
                role="menuitem"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  textAlign: "left",
                  border: "none",
                  borderRadius: 4,
                  background: "transparent",
                  color: "#e6edf3",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Teacher Experience PDS
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(230,237,243,0.85)" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: synced ? "#3fb950" : "#d29922",
            }}
          />
          {synced ? "Synced" : "Unsaved"}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={synced}
          onClick={() => setSynced((s) => !s)}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            border: "none",
            background: synced ? "rgba(63,185,80,0.4)" : "rgba(255,255,255,0.15)",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: synced ? 20 : 2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#e6edf3",
              transition: "left 0.15s ease",
            }}
          />
        </button>
      </div>
    </header>
  );
}
