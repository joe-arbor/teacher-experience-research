"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { PROBLEM_THEMES, getThemesForSubCategory, assignRowToTheme } from "@/app/problemThemes";
import { getHmw } from "@/app/hmwStatements";
import type { FeedbackRow } from "@/app/types";
import { ExternalLink, Copy, Check } from "lucide-react";

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

/** AC draft per acceptance-criteria-specialist skill: themed, testable, workflow-aware, problem-led. */
interface AcDraft {
  summary: string;
  happyPath: string[];
  edgeCasesAndVariants: string[];
  errorsAndRecovery: string[];
  permissionsAndCollaboration: string[];
  performanceAndReliability: string[];
  crossFeatureBehavior: string[];
  assumptions: string[];
  openQuestions: string[];
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

function formatAcCardForCopy(item: ThemeItem, ac: AcDraft): string {
  const sections: string[] = [item.label, item.category, item.subCategory];
  if (item.hmw) sections.push(`HMW: ${item.hmw}`);
  if (ac.summary) sections.push(`Summary: ${ac.summary}`);
  const list = (title: string, arr: string[]) =>
    arr.length ? `${title}:\n${arr.map((s) => `• ${s}`).join("\n")}` : "";
  sections.push(
    list("Happy path", ac.happyPath),
    list("Edge cases & variants", ac.edgeCasesAndVariants),
    list("Errors & recovery", ac.errorsAndRecovery),
    list("Permissions & collaboration", ac.permissionsAndCollaboration),
    list("Performance & reliability", ac.performanceAndReliability),
    list("Cross-feature behavior", ac.crossFeatureBehavior),
    list("Assumptions", ac.assumptions),
    list("Open questions", ac.openQuestions)
  );
  return sections.filter(Boolean).join("\n\n");
}

function inferRole(category: string): string {
  if (category === "Attendance & Registers") return "Attendance staff";
  if (category === "Behaviour Management") return "Teachers and behaviour teams";
  return "Classroom staff and teachers";
}

function extractOutcomeFromHmw(hmw: string | undefined): string | null {
  if (!hmw) return null;
  const soThatMatch = hmw.match(
    /so that (?:they|staff|teachers?|schools?|leaders?|teams?|admins?|officers?|managers?|data managers?|kitchen teams?|families?|pupils?|students?) can ([^.?]+)/i
  );
  if (soThatMatch) return soThatMatch[1].trim();
  const afterSoThat = hmw.indexOf("so that") >= 0 ? hmw.substring(hmw.indexOf("so that")) : "";
  const canMatch = afterSoThat.match(/can ([^.?]+)/i);
  return canMatch ? canMatch[1].trim() : null;
}

/**
 * Builds acceptance criteria from problem context (theme + HMW) using acceptance-criteria-specialist skill.
 */
function generateAcceptanceCriteria(item: ThemeItem): AcDraft {
  const area = mapCategoryToArea(item.category);
  const role = inferRole(item.category);
  const outcome = extractOutcomeFromHmw(item.hmw ?? undefined);
  const context = `${item.subCategory} (${item.label})`;
  const summary =
    outcome &&
    `Enable ${role.toLowerCase()} to ${outcome} in the context of ${context}, in a single predictable workflow with minimal steps and clear feedback.`;

  const happyPath: string[] = [];
  const edgeCasesAndVariants: string[] = [];
  const errorsAndRecovery: string[] = [];
  const permissionsAndCollaboration: string[] = [];
  const performanceAndReliability: string[] = [];
  const crossFeatureBehavior: string[] = [];
  const assumptions: string[] = [];
  const openQuestions: string[] = [];

  if (area === "Attendance") {
    happyPath.push(
      `Given a user with the right role for ${item.subCategory.toLowerCase()}, when they start the workflow for "${item.label}", then they can complete the main task from one place without opening more than one additional screen.`,
      `When the user saves or submits changes for "${item.label}", then the updated data appears in list and summary views within a short, predictable time so the team has a single source of truth.`
    );
    edgeCasesAndVariants.push(
      `When there is no data or the list is empty for "${item.label}", then the UI shows a clear empty state and a single obvious next action (e.g. add, import), not a dead-end.`,
      `When the user has filtered or sorted the view, then creating or editing an item for "${item.label}" keeps the current filter and sort so they do not lose context.`
    );
    errorsAndRecovery.push(
      `If save or submit fails (e.g. network error), then the user sees a non-blocking error message and can retry without re-entering data.`,
      `When attendance data for "${item.label}" is missing or overridden, then the system shows who last changed it and what action is required so users can correct or escalate.`
    );
    permissionsAndCollaboration.push(
      `Users without permission to change data for "${item.label}" do not see edit or submit affordances; read-only views remain available where appropriate.`,
      `If another user changes the same record, then the current user sees an update (or conflict message) without needing a full page reload.`
    );
    performanceAndReliability.push(
      `The primary action for "${item.label}" (e.g. open form, apply bulk change) responds within a reasonable time (e.g. under 2s in normal conditions) so the workflow does not feel blocked.`
    );
    crossFeatureBehavior.push(
      `Changes to "${item.label}" data are reflected in related reports and dashboards that consume this data, so leaders and other staff see consistent numbers.`
    );
  } else if (area === "Behaviour") {
    happyPath.push(
      `Given a teacher or behaviour lead, when they log or review something for "${item.label}", then they can do it in a small number of steps without leaving the lesson context or re-entering information they have already provided.`,
      `When the user views a behaviour timeline or summary for "${item.label}", then it is obvious what happened, who is involved, and what the next action is, without manual cross-referencing.`
    );
    edgeCasesAndVariants.push(
      `When there are no incidents or points for the selected period for "${item.label}", then the UI shows a clear empty state and optional next action (e.g. log first incident), not a blank or confusing screen.`,
      `When the user is in a filtered view (e.g. by pupil, by type), then adding or editing for "${item.label}" keeps the selection so they stay in context.`
    );
    errorsAndRecovery.push(
      `If logging or saving fails, then the user sees a clear error and can retry without losing what they entered.`,
      `High-impact changes for "${item.label}" (e.g. deleting a record) have a confirm step or undo so users can recover from mistakes.`
    );
    permissionsAndCollaboration.push(
      `Visibility and notifications for "${item.label}" ensure the right staff, students, and guardians see relevant information; users without access do not see sensitive details.`,
      `When multiple staff can edit behaviour data, then conflicts or concurrent edits are handled (e.g. last-write wins with notice, or lock) so data stays consistent.`
    );
    performanceAndReliability.push(
      `Opening the logging flow or summary for "${item.label}" feels responsive (e.g. under 1–2s) so it can be used during or immediately after a lesson.`
    );
    crossFeatureBehavior.push(
      `Behaviour data for "${item.label}" is available where it is needed (e.g. register view, report cards, pastoral notes) without the user re-entering or copying.`
    );
  } else {
    happyPath.push(
      `Given classroom staff, when they need to act on "${item.label}", then they can do it from their main teaching workspace (e.g. lesson dashboard, seating view) without opening a separate admin tool.`,
      `When the user views classroom or lesson information for "${item.label}", then it is legible, scannable, and consistent so they can act quickly during live lessons.`
    );
    edgeCasesAndVariants.push(
      `When room, timetable, or layout data is missing or incomplete for "${item.label}", then the UI shows a clear state and path to fix (e.g. link to settings, contact admin), not a broken or empty layout.`,
      `When the user switches device or view (e.g. from board to tablet), then key information for "${item.label}" is still available and consistent.`
    );
    errorsAndRecovery.push(
      `If a change fails (e.g. room swap, seating save), then the user sees a clear message and can retry or revert; they do not lose unsaved work.`,
      `Critical changes for "${item.label}" (e.g. room change affecting many lessons) have a confirm or review step so accidental bulk changes can be avoided.`
    );
    permissionsAndCollaboration.push(
      `Only users with the right role can edit room, timetable, or layout for "${item.label}"; others see read-only or no edit controls.`,
      `When cover or timetable changes, then staff and students see the updated information (who is teaching, where) without manual refresh.`
    );
    performanceAndReliability.push(
      `Loading the main classroom or lesson view for "${item.label}" is fast enough for use at the start of a lesson (e.g. under 2s) so teachers are not waiting.`
    );
    crossFeatureBehavior.push(
      `Room, timetable, or layout changes for "${item.label}" stay in sync with attendance, behaviour, and reporting so the user does not re-enter the same information elsewhere.`
    );
  }

  assumptions.push(
    `Primary users are ${role}; environment is typically web or school devices.`,
    `Workflow is used in a school day context; real-time or near-real-time updates are expected where multiple people use the same data.`
  );
  openQuestions.push(
    `How often is this workflow used per user per day? (Informs performance and prominence.)`,
    `Are there statutory or safeguarding constraints that change permissions or audit requirements?`
  );

  return {
    summary:
      summary ||
      `Workflow for ${context}: reduce friction and clarify next actions so ${role.toLowerCase()} can complete the job predictably.`,
    happyPath,
    edgeCasesAndVariants,
    errorsAndRecovery,
    permissionsAndCollaboration,
    performanceAndReliability,
    crossFeatureBehavior,
    assumptions,
    openQuestions,
  };
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

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyCard = useCallback((item: ThemeItem, ac: AcDraft) => {
    const text = formatAcCardForCopy(item, ac);
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedId(`${item.category}|${item.subCategory}|${item.themeId}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

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
                        const ac = generateAcceptanceCriteria(item);
                        const sectionStyle = {
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.06em",
                          color: "#57606a",
                          marginBottom: 4,
                        };
                        const listStyle = {
                          margin: 0,
                          paddingLeft: 18,
                          fontSize: 13,
                          color: "#24292f",
                          display: "flex" as const,
                          flexDirection: "column" as const,
                          gap: 4,
                        };
                        const renderList = (title: string, bullets: string[]) =>
                          bullets.length > 0 ? (
                            <div key={title} style={{ marginBottom: 10 }}>
                              <div style={sectionStyle}>{title}</div>
                              <ol style={listStyle}>
                                {bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ol>
                            </div>
                          ) : null;
                        const cardKey = `${item.category}|${item.subCategory}|${item.themeId}`;
                        const copied = copiedId === cardKey;
                        return (
                          <li
                            key={cardKey}
                            style={{
                              padding: "14px 16px",
                              background: "#f6f8fa",
                              borderRadius: 8,
                              border: "1px solid #d0d7de",
                              position: "relative",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => copyCard(item, ac)}
                              title="Copy card"
                              style={{
                                position: "absolute",
                                top: 14,
                                right: 14,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 28,
                                height: 28,
                                padding: 0,
                                border: "none",
                                borderRadius: 6,
                                background: copied ? "#dafbe1" : "#eaeef2",
                                color: copied ? "#1a7f37" : "#57606a",
                                cursor: "pointer",
                              }}
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                                marginBottom: 4,
                                flexWrap: "wrap",
                                paddingRight: 36,
                              }}
                            >
                              <div style={{ fontWeight: 600, color: "#24292f" }}>
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

                            {ac.summary && (
                              <p
                                style={{
                                  margin: "0 0 10px 0",
                                  fontSize: 13,
                                  color: "#24292f",
                                  fontWeight: 500,
                                }}
                              >
                                <strong>Summary:</strong> {ac.summary}
                              </p>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8 }}>
                              {renderList("Happy path", ac.happyPath)}
                              {renderList("Edge cases & variants", ac.edgeCasesAndVariants)}
                              {renderList("Errors & recovery", ac.errorsAndRecovery)}
                              {renderList("Permissions & collaboration", ac.permissionsAndCollaboration)}
                              {renderList("Performance & reliability", ac.performanceAndReliability)}
                              {renderList("Cross-feature behavior", ac.crossFeatureBehavior)}
                              {renderList("Assumptions", ac.assumptions)}
                              {renderList("Open questions", ac.openQuestions)}
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

