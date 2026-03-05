"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { PROBLEM_THEMES, getThemesForSubCategory, assignRowToTheme } from "@/app/problemThemes";
import { getHmw } from "@/app/hmwStatements";
import type { FeedbackRow } from "@/app/types";
import { ExternalLink } from "lucide-react";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management"] as const;

type Area = "Attendance" | "Behaviour" | "Classroom";

interface ThemeItem {
  category: string;
  subCategory: string;
  themeId: string;
  label: string;
  description?: string;
  hmw: string | undefined;
  cardCount: number;
  categorySharePct: number | null;
}

interface AcSection {
  area: Area;
  bullets: string[];
}

function mapCategoryToArea(category: string): Area {
  if (category === "Attendance & Registers") return "Attendance";
  if (category === "Behaviour Management") return "Behaviour";
  return "Classroom";
}

function buildEvidenceUrl(category: string, subCategory: string, themeId: string): string {
  const params = new URLSearchParams({
    category,
    sub: subCategory,
    theme: themeId,
  });
  return `/categories?${params.toString()}`;
}

function generateAcceptanceCriteria(item: ThemeItem): AcSection[] {
  const area = mapCategoryToArea(item.category);
  const baseContext = item.hmw ?? item.label;

  const sharedBullets: string[] = [
    `The workflow for “${item.label}” can be completed end-to-end from a single, predictable place without needing to open more than one additional view.`,
    `Users receive clear feedback at each step (loading, success, failure) so they always know what happened and what to do next when working on “${item.label}”.`,
    `Undo or safe recovery is available for high‑impact changes related to “${item.label}”, so users can correct mistakes without data loss.`,
  ];

  if (area === "Attendance") {
    return [
      {
        area,
        bullets: [
          `Attendance staff can complete common “${item.subCategory.toLowerCase()}” tasks for “${baseContext}” in a small number of focused steps, without jumping between multiple attendance screens.`,
          `Any changes to attendance data for “${item.label}” update summary views and reports within a short, predictable time window so teams have a single source of truth.`,
          `When attendance data for “${item.label}” is missing, conflicting, or overridden, the system clearly shows who last changed it and what action is required.`,
          ...sharedBullets,
        ],
      },
    ];
  }

  if (area === "Behaviour") {
    return [
      {
        area,
        bullets: [
          `Teachers can log or review behaviour events related to “${baseContext}” without losing control of the lesson or needing to re‑enter context they have already provided.`,
          `Behaviour timelines and summaries for “${item.label}” make it obvious what has already happened, who is involved, and what the next action is, without manual cross‑referencing.`,
          `Notifications and visibility rules for “${item.label}” ensure the right staff, students, and guardians see relevant information without noisy or duplicate alerts.`,
          ...sharedBullets,
        ],
      },
    ];
  }

  return [
    {
      area,
      bullets: [
        `Classroom staff can act on “${baseContext}” directly from their main teaching workspace (e.g. lesson dashboard, seating view) without needing to open a separate admin tool.`,
        `Information shown in classroom views for “${item.label}” is legible, accessible, and consistent across devices so teachers can quickly scan and act during live lessons.`,
        `Room, timetable, or layout changes related to “${item.label}” stay in sync with attendance, behaviour, and reporting views without manual re‑entry.`,
        ...sharedBullets,
      ],
    },
  ];
}

export default function AcAiDraftView() {
  const themeReady = useThemeReady();

  const [data, setData] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  useEffect(() => {
    fetch("/teacher_experience_data.json")
      .then((res) => res.json())
      .then((json: unknown) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const { themeCounts, categoryTotals } = useMemo(() => {
    const themeCounts: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    data.forEach((r) => {
      if (!CATEGORIES.includes(r.top_level_category as (typeof CATEGORIES)[number])) return;
      if (!r.sub_category || r.sub_category === "Uncategorised") return;
      const category = r.top_level_category;
      const subCategory = r.sub_category;
      const themes = getThemesForSubCategory(category, subCategory);
      if (!themes.length) return;
      const themeId = assignRowToTheme(r, themes);
      if (themeId === "other") return;
      const key = `${category}|${subCategory}|${themeId}`;
      themeCounts[key] = (themeCounts[key] ?? 0) + 1;
      categoryTotals[category] = (categoryTotals[category] ?? 0) + 1;
    });
    return { themeCounts, categoryTotals };
  }, [data]);

  const items = useMemo<ThemeItem[]>(() => {
    const out: ThemeItem[] = [];
    for (const [mapKey, themes] of Object.entries(PROBLEM_THEMES)) {
      const [category, subCategory] = mapKey.split("|");
      for (const theme of themes) {
        if (theme.id === "other") continue;
        const key = `${category}|${subCategory}|${theme.id}`;
        const count = themeCounts[key] ?? 0;
        const totalInCategory = categoryTotals[category] ?? 0;
        const share =
          count > 0 && totalInCategory > 0 ? Math.round((count / totalInCategory) * 100) : null;
        out.push({
          category,
          subCategory,
          themeId: theme.id,
          label: theme.label,
          description: theme.description,
          hmw: getHmw(category, subCategory, theme.id),
          cardCount: count,
          categorySharePct: share,
        });
      }
    }
    return out;
  }, [themeCounts, categoryTotals]);

  const byCategory = useMemo(() => {
    const map = new Map<string, Map<string, ThemeItem[]>>();
    for (const item of items) {
      if (!map.has(item.category)) map.set(item.category, new Map());
      const subMap = map.get(item.category)!;
      if (!subMap.has(item.subCategory)) subMap.set(item.subCategory, []);
      subMap.get(item.subCategory)!.push(item);
    }
    return map;
  }, [items]);

  if (!themeReady || loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        {!themeReady ? "Loading…" : "Loading teacher experience data…"}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>AC AI Draft</Heading>
        <p style={{ color: "#666", marginBottom: 12 }}>
          Draft acceptance criteria for each How Might We theme, grouped into Behaviour, Attendance,
          and Classroom workflows. Use these as a starting point for PMs and designers to shape
          prototypes that test the underlying hypotheses.
        </p>
      </HeadingLevel>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {[
          { key: "all", label: "All areas" },
          { key: "Attendance & Registers", label: "Attendance" },
          { key: "Behaviour Management", label: "Behaviour" },
          { key: "Classroom Management", label: "Classroom" },
        ].map((opt) => {
          const active = selectedCategory === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedCategory(opt.key as typeof selectedCategory)}
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                border: active ? "1px solid #0969da" : "1px solid #d0d7de",
                background: active ? "#e7f3ff" : "#ffffff",
                color: active ? "#0969da" : "#24292f",
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {Array.from(byCategory.entries())
          .filter(([category]) => selectedCategory === "all" || category === selectedCategory)
          .map(([category, subMap]) => {
          const area = mapCategoryToArea(category);
          return (
            <section key={category}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#24292f",
                  marginBottom: 4,
                  paddingBottom: 4,
                  borderBottom: "1px solid #d0d7de",
                }}
              >
                {area} – {category}
              </h2>
              <p style={{ fontSize: 13, color: "#57606a", marginBottom: 16 }}>
                Draft AC focus on reducing clicks, clarifying next actions, and making this workflow
                predictable across the product.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {Array.from(subMap.entries()).map(([subCategory, themeItems]) => (
                  <div key={`${category}-${subCategory}`}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#57606a",
                        marginBottom: 10,
                      }}
                    >
                      {subCategory}
                    </h3>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {themeItems.map((item) => {
                        const sections = generateAcceptanceCriteria(item);
                        return (
                          <li
                            key={`${item.category}|${item.subCategory}|${item.themeId}`}
                            style={{
                              padding: "14px 16px",
                              background: "#f6f8fa",
                              borderRadius: 8,
                              border: "1px solid #d0d7de",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                                marginBottom: 4,
                                flexWrap: "wrap",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#24292f",
                                }}
                              >
                                {item.label}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "2px 10px",
                                    borderRadius: 999,
                                    background: "#eaeef2",
                                    color: "#24292f",
                                    fontSize: 11,
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.cardCount} feedback card
                                  {item.cardCount === 1 ? "" : "s"}
                                </span>
                                {item.categorySharePct != null && (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      padding: "2px 10px",
                                      borderRadius: 999,
                                      background: "#e6f4ea",
                                      color: "#1a7f37",
                                      fontSize: 11,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item.categorySharePct}% of {item.category} feedback
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.hmw && (
                              <p
                                style={{
                                  margin: "0 0 8px 0",
                                  fontSize: 13,
                                  color: "#24292f",
                                  fontStyle: "italic",
                                }}
                              >
                                {item.hmw}
                              </p>
                            )}

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              {sections.map((section) => (
                                <div key={section.area}>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.06em",
                                      color: "#57606a",
                                      marginBottom: 4,
                                    }}
                                  >
                                    {section.area} – Draft AC
                                  </div>
                                  <ul
                                    style={{
                                      margin: 0,
                                      paddingLeft: 18,
                                      fontSize: 13,
                                      color: "#24292f",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 2,
                                    }}
                                  >
                                    {section.bullets.map((b) => (
                                      <li key={b}>{b}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            <Link
                              href={buildEvidenceUrl(item.category, item.subCategory, item.themeId)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                color: "#0969da",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <ExternalLink size={14} />
                              View supporting quotes in Category view
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

