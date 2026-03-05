"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  History,
  GraduationCap,
  BarChart3,
  MessageSquareQuote,
  Target,
  Star,
  Newspaper,
  ChevronDown,
  ChevronRight,
  FileText,
  Lightbulb,
  CheckSquare,
  AlertCircle,
  Calendar,
} from "lucide-react";

const SIDEBAR_WIDTH = 260;

const ICON_SIZE = 18;

const PRODUCT_FEEDBACK_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Jira Feedback Dashboard", Icon: BarChart3 },
  { href: "/categories", label: "Category quotes", Icon: MessageSquareQuote },
  { href: "/problems", label: "Product problems", Icon: Target },
];

const TEACHER_NPS_2025_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/nps", label: "NPS Feedback Categories", Icon: Star },
  { href: "/nps/headlines", label: "NPS Headlines", Icon: Newspaper },
];

const DOC_ITEMS = [
  { href: "/docs/teacher-experience-pds", name: "Teacher Experience PDS.pdf" },
  { href: "/docs/design-brief", name: "Design Brief.pdf" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isChangelog = pathname === "/changelog";
  const isDesignHmw = pathname === "/design-hmw";
  const isNpsHmw = pathname === "/nps-hmw";
  const isDesignSprint = pathname === "/design-sprint";
  const isAcAiDraft = pathname === "/ac-ai-draft";
  const isProblemStatements = pathname === "/problem-statements";
  const isProductFeedbackActive = PRODUCT_FEEDBACK_ITEMS.some((item) => pathname === item.href);
  const isTeacherNpsActive = TEACHER_NPS_2025_ITEMS.some((item) => pathname === item.href);
  const [productFeedbackOpen, setProductFeedbackOpen] = useState(isProductFeedbackActive);
  const [teacherNpsOpen, setTeacherNpsOpen] = useState(isTeacherNpsActive);
  const isAiSuggestedActive = isDesignHmw || isNpsHmw || isAcAiDraft || isProblemStatements;
  const [aiSuggestedOpen, setAiSuggestedOpen] = useState(isAiSuggestedActive);

  useEffect(() => {
    if (isProductFeedbackActive) setProductFeedbackOpen(true);
  }, [isProductFeedbackActive]);

  useEffect(() => {
    if (isTeacherNpsActive) setTeacherNpsOpen(true);
  }, [isTeacherNpsActive]);

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
        <Link
          href="/"
          className="sidebar-nav-link"
          data-active={isHome}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 2,
            textDecoration: "none",
            color: isHome ? "#24292f" : "#57606a",
            background: isHome ? "#eaeef2" : "transparent",
            fontWeight: isHome ? 600 : 400,
            fontSize: 14,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", width: 20 }}>
            <Home size={ICON_SIZE} />
          </span>
          <span style={{ flex: 1 }}>Overview</span>
        </Link>
        <Link
          href="/changelog"
          className="sidebar-nav-link"
          data-active={isChangelog}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 2,
            textDecoration: "none",
            color: isChangelog ? "#24292f" : "#57606a",
            background: isChangelog ? "#eaeef2" : "transparent",
            fontWeight: isChangelog ? 600 : 400,
            fontSize: 14,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", width: 20 }}>
            <History size={ICON_SIZE} />
          </span>
          <span style={{ flex: 1 }}>Changelog</span>
        </Link>
        <div style={{ marginBottom: 2 }}>
          <button
            type="button"
            onClick={() => setProductFeedbackOpen((open) => !open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: isProductFeedbackActive ? "#eaeef2" : "transparent",
              color: isProductFeedbackActive ? "#24292f" : "#57606a",
              fontWeight: isProductFeedbackActive ? 600 : 400,
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", width: 20 }}>
              {productFeedbackOpen ? (
                <ChevronDown size={ICON_SIZE} />
              ) : (
                <ChevronRight size={ICON_SIZE} />
              )}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <GraduationCap size={ICON_SIZE} />
              Product Feedback
            </span>
          </button>
          {productFeedbackOpen &&
            PRODUCT_FEEDBACK_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.Icon;
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
                    padding: "8px 12px 8px 38px",
                    borderRadius: 6,
                    marginBottom: 2,
                    textDecoration: "none",
                    color: active ? "#24292f" : "#57606a",
                    background: active ? "#eaeef2" : "transparent",
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                    <Icon size={ICON_SIZE} />
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
        </div>

        <div style={{ marginBottom: 2 }}>
          <button
            type="button"
            onClick={() => setTeacherNpsOpen((open) => !open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: isTeacherNpsActive ? "#eaeef2" : "transparent",
              color: isTeacherNpsActive ? "#24292f" : "#57606a",
              fontWeight: isTeacherNpsActive ? 600 : 400,
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", width: 20 }}>
              {teacherNpsOpen ? (
                <ChevronDown size={ICON_SIZE} />
              ) : (
                <ChevronRight size={ICON_SIZE} />
              )}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <Star size={ICON_SIZE} />
              Teacher NPS 2025
            </span>
          </button>
          {teacherNpsOpen &&
            TEACHER_NPS_2025_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.Icon;
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
                    padding: "8px 12px 8px 38px",
                    borderRadius: 6,
                    marginBottom: 2,
                    textDecoration: "none",
                    color: active ? "#24292f" : "#57606a",
                    background: active ? "#eaeef2" : "transparent",
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                    <Icon size={ICON_SIZE} />
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
        </div>

        <div style={{ marginBottom: 2 }}>
          <button
            type="button"
            onClick={() => setAiSuggestedOpen((open) => !open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: isAiSuggestedActive ? "#eaeef2" : "transparent",
              color: isAiSuggestedActive ? "#24292f" : "#57606a",
              fontWeight: isAiSuggestedActive ? 600 : 400,
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", width: 20 }}>
              {aiSuggestedOpen ? (
                <ChevronDown size={ICON_SIZE} />
              ) : (
                <ChevronRight size={ICON_SIZE} />
              )}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <Lightbulb size={ICON_SIZE} />
              AI-Suggested Actions
            </span>
          </button>
          {aiSuggestedOpen && (
            <>
              <Link
                href="/design-hmw"
                className="sidebar-nav-link"
                data-active={isDesignHmw}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px 8px 38px",
                  borderRadius: 6,
                  marginBottom: 2,
                  textDecoration: "none",
                  color: isDesignHmw ? "#24292f" : "#57606a",
                  background: isDesignHmw ? "#eaeef2" : "transparent",
                  fontWeight: isDesignHmw ? 600 : 400,
                  fontSize: 14,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                  <Lightbulb size={ICON_SIZE} />
                </span>
                <span style={{ flex: 1 }}>Design HMW</span>
              </Link>
              <Link
                href="/nps-hmw"
                className="sidebar-nav-link"
                data-active={isNpsHmw}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px 8px 38px",
                  borderRadius: 6,
                  marginBottom: 2,
                  textDecoration: "none",
                  color: isNpsHmw ? "#24292f" : "#57606a",
                  background: isNpsHmw ? "#eaeef2" : "transparent",
                  fontWeight: isNpsHmw ? 600 : 400,
                  fontSize: 14,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                  <Star size={ICON_SIZE} />
                </span>
                <span style={{ flex: 1 }}>NPS HMW</span>
              </Link>
              <Link
                href="/problem-statements"
                className="sidebar-nav-link"
                data-active={isProblemStatements}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px 8px 38px",
                  borderRadius: 6,
                  marginBottom: 2,
                  textDecoration: "none",
                  color: isProblemStatements ? "#24292f" : "#57606a",
                  background: isProblemStatements ? "#eaeef2" : "transparent",
                  fontWeight: isProblemStatements ? 600 : 400,
                  fontSize: 14,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                  <AlertCircle size={ICON_SIZE} />
                </span>
                <span style={{ flex: 1 }}>Problem Statements</span>
              </Link>
              <Link
                href="/ac-ai-draft"
                className="sidebar-nav-link"
                data-active={isAcAiDraft}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px 8px 38px",
                  borderRadius: 6,
                  marginBottom: 2,
                  textDecoration: "none",
                  color: isAcAiDraft ? "#24292f" : "#57606a",
                  background: isAcAiDraft ? "#eaeef2" : "transparent",
                  fontWeight: isAcAiDraft ? 600 : 400,
                  fontSize: 14,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", width: 20 }}>
                  <CheckSquare size={ICON_SIZE} />
                </span>
                <span style={{ flex: 1 }}>AC AI Draft</span>
              </Link>
            </>
          )}
        </div>
        <Link
          href="/design-sprint"
          className="sidebar-nav-link"
          data-active={isDesignSprint}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 2,
            textDecoration: "none",
            color: isDesignSprint ? "#24292f" : "#57606a",
            background: isDesignSprint ? "#eaeef2" : "transparent",
            fontWeight: isDesignSprint ? 600 : 400,
            fontSize: 14,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", width: 20 }}>
            <Calendar size={ICON_SIZE} />
          </span>
          <span style={{ flex: 1 }}>Design Sprint</span>
        </Link>
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
              <span style={{ display: "flex", alignItems: "center" }}>
                <FileText size={16} />
              </span>
              {doc.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
