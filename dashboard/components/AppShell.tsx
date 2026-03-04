"use client";

import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#eaeef2",
      }}
    >
      <TopBar />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
            position: "relative",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
