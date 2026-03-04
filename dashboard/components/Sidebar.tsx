"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_WIDTH = 260;

const NAV_ITEMS: { href: string; label: string; icon: string; count?: number }[] = [
  { href: "/", label: "Overview", icon: "▣" },
  { href: "/dashboard", label: "Jira Feedback Dashboard", icon: "📊", count: 1 },
  { href: "/categories", label: "Category quotes", icon: "💬", count: 1 },
  { href: "#", label: "Research", icon: "▥", count: 1 },
  { href: "#", label: "Design Prototypes", icon: "▦" },
  { href: "#", label: "Competitive Analysis", icon: "▧" },
  { href: "#", label: "Intermission", icon: "▨", count: 2 },
  { href: "#", label: "Activation Strategy", icon: "▩", count: 1 },
];

const DOC_ITEMS = [
  { href: "/docs/teacher-experience-pds", name: "Teacher Experience PDS.pdf" },
  { href: "/docs/design-brief", name: "Design Brief.pdf" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        background: "#ffffff",
        borderRight: "1px solid #d0d7de",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        flexShrink: 0,
      }}
    >
      <nav style={{ padding: "12px 8px", flex: "0 0 auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? isHome : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-nav-link"
              data-active={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 6,
                marginBottom: 2,
                textDecoration: "none",
                color: active ? "#24292f" : "#57606a",
                background: active ? "#eaeef2" : "transparent",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count != null && (
                <span style={{ fontSize: 11, color: "#57606a", fontWeight: 500 }}>{item.count}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div style={{ height: 1, background: "#d0d7de", margin: "4px 0" }} />
      <div style={{ padding: "8px 12px 16px", flex: "1 1 auto", minHeight: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#57606a", letterSpacing: "0.05em", marginBottom: 8 }}>
          PROJECT FILES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DOC_ITEMS.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#24292f",
                fontSize: 13,
              }}
            >
              <span style={{ fontSize: 14 }}>📄</span>
              {doc.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
