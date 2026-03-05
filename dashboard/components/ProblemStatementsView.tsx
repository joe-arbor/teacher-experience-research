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

function buildEvidenceUrl(category: string, subCategory: string, themeId: string): string {
  const params = new URLSearchParams({
    category,
    sub: subCategory,
    theme: themeId,
  });
  return `/categories?${params.toString()}`;
}

/**
 * Infers primary role(s) from top-level category for problem statements.
 * Aligned with problem-definition-expert: use full context (category, theme) to scope who is affected.
 */
function inferRole(category: string): string {
  if (category === "Attendance & Registers") return "Attendance staff";
  if (category === "Behaviour Management") return "Teachers and behaviour teams";
  return "Classroom staff and teachers";
}

/**
 * Extracts the desired outcome from HMW text (e.g. "so that they can X" -> "X").
 * Returns null if no clear outcome phrase found.
 */
function extractOutcomeFromHmw(hmw: string | undefined): string | null {
  if (!hmw) return null;
  const soThatMatch = hmw.match(/so that (?:they|staff|teachers?|schools?|leaders?|teams?|admins?|officers?|managers?|data managers?|kitchen teams?|families?|pupils?|students?) can ([^.?]+)/i);
  if (soThatMatch) return soThatMatch[1].trim();
  const forMatch = hmw.match(/for (?:[\w\s]+) so that [^.?]+/i);
  if (forMatch) {
    const afterSoThat = hmw.substring(hmw.indexOf("so that"));
    const canMatch = afterSoThat.match(/can ([^.?]+)/i);
    if (canMatch) return canMatch[1].trim();
  }
  return null;
}

/**
 * Generates problem-first statements from theme + HMW using problem-definition-expert principles:
 * [Role] cannot [outcome] when [context], which leads to [impact].
 * Evidence is the theme/category; no solution or feature language.
 */
function generateProblemStatements(item: ThemeItem): string[] {
  const role = inferRole(item.category);
  const context = `${item.subCategory.toLowerCase()} (${item.label.toLowerCase()})`;
  const outcome = extractOutcomeFromHmw(item.hmw ?? undefined);
  const statements: string[] = [];

  if (outcome) {
    statements.push(
      `${role} cannot ${outcome} when working in ${context}, which leads to friction, workarounds, or missed outcomes that the current system does not address.`
    );
    statements.push(
      `When ${context}, ${role} lack a clear or efficient way to achieve this outcome, so the job is either skipped, done manually elsewhere, or done with higher effort than it should require.`
    );
  } else {
    statements.push(
      `${role} experience a gap or friction in ${context}, which leads to extra effort, inconsistency, or unmet needs that are not well served by the current product.`
    );
  }

  return statements;
}

export default function ProblemStatementsView() {
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
        <Heading style={{ marginBottom: 8 }}>Problem Statements</Heading>
        <p style={{ color: "#666", marginBottom: 12 }}>
          Problem-first statements derived from each theme and How Might We. Use these so design and
          product can collaborate on possible solutions and then define acceptance criteria—without
          jumping to solutions first.
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
          .map(([category, subMap]) => (
            <section key={category}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#24292f",
                  marginBottom: 16,
                  paddingBottom: 4,
                  borderBottom: "1px solid #d0d7de",
                }}
              >
                {category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {Array.from(subMap.entries()).map(([subCategory, themeItems]) => (
                  <div key={`${category}-${subCategory}`}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#57606a",
                        marginBottom: 12,
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
                        const problemStatements = generateProblemStatements(item);
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
                                fontWeight: 600,
                                color: "#24292f",
                                marginBottom: 6,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                marginBottom: 8,
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
                            {item.hmw && (
                              <p
                                style={{
                                  margin: "0 0 10px 0",
                                  fontSize: 13,
                                  color: "#57606a",
                                  fontStyle: "italic",
                                }}
                              >
                                {item.hmw}
                              </p>
                            )}
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "#57606a",
                                marginBottom: 6,
                              }}
                            >
                              Problem statements
                            </div>
                            <ol
                              style={{
                                margin: 0,
                                paddingLeft: 20,
                                fontSize: 13,
                                color: "#24292f",
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {problemStatements.map((ps, idx) => (
                                <li key={idx}>{ps}</li>
                              ))}
                            </ol>
                            <Link
                              href={buildEvidenceUrl(item.category, item.subCategory, item.themeId)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 10,
                                fontSize: 13,
                                color: "#0969da",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <ExternalLink size={14} />
                              View evidence in Category quotes
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
