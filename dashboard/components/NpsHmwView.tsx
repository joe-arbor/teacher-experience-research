"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { PROBLEM_THEMES, getThemesForSubCategory } from "@/app/problemThemes";
import { getNpsHmw } from "@/app/npsHmwStatements";
import type { NpsRow } from "@/app/types";
import { ExternalLink, Copy, Check } from "lucide-react";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management"] as const;

interface NpsThemeItem {
  category: string;
  subCategory: string;
  themeId: string;
  label: string;
  hmw: string | undefined;
  responseCount: number;
  categorySharePct: number | null;
}

function buildNpsEvidenceUrl(category: string, subCategory: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (subCategory) params.set("sub", subCategory);
  return `/nps?${params.toString()}`;
}

function getThemeLabel(category: string, subCategory: string, themeId: string): string {
  const themes = getThemesForSubCategory(category, subCategory);
  const theme = themes.find((t) => t.id === themeId);
  return theme?.label ?? themeId.replace(/-/g, " ");
}

export default function NpsHmwView() {
  const themeReady = useThemeReady();
  const [data, setData] = useState<NpsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCard = useCallback((item: NpsThemeItem) => {
    const text = [item.label, item.hmw].filter(Boolean).join("\n\n");
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedId(`${item.category}|${item.subCategory}|${item.themeId}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  useEffect(() => {
    fetch("/nps_feedback_2025.json")
      .then((res) => res.json())
      .then((json: unknown) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const { themeCounts, categoryTotals } = useMemo(() => {
    const themeCounts: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    data.forEach((r) => {
      const category = r.top_level_category ?? "";
      const subCategory = r.sub_category ?? "";
      const themeId = r.theme_id ?? "";
      if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return;
      if (subCategory === "Uncategorised" || themeId === "other") return;
      const key = `${category}|${subCategory}|${themeId}`;
      themeCounts[key] = (themeCounts[key] ?? 0) + 1;
      categoryTotals[category] = (categoryTotals[category] ?? 0) + 1;
    });
    return { themeCounts, categoryTotals };
  }, [data]);

  const items = useMemo<NpsThemeItem[]>(() => {
    const seen = new Set<string>();
    const out: NpsThemeItem[] = [];
    data.forEach((r) => {
      const category = r.top_level_category ?? "";
      const subCategory = r.sub_category ?? "";
      const themeId = r.theme_id ?? "";
      if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return;
      if (subCategory === "Uncategorised" || themeId === "other") return;
      const key = `${category}|${subCategory}|${themeId}`;
      if (seen.has(key)) return;
      seen.add(key);
      const count = themeCounts[key] ?? 0;
      const totalInCategory = categoryTotals[category] ?? 0;
      const share =
        count > 0 && totalInCategory > 0 ? Math.round((count / totalInCategory) * 100) : null;
      out.push({
        category,
        subCategory,
        themeId,
        label: getThemeLabel(category, subCategory, themeId),
        hmw: getNpsHmw(category, subCategory, themeId),
        responseCount: count,
        categorySharePct: share,
      });
    });
    return out.sort((a, b) => b.responseCount - a.responseCount);
  }, [data, themeCounts, categoryTotals]);

  const byCategory = useMemo(() => {
    const map = new Map<string, Map<string, NpsThemeItem[]>>();
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
        {!themeReady ? "Loading…" : "Loading NPS data…"}
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
        <Heading style={{ marginBottom: 8 }}>NPS HMW</Heading>
        <p style={{ color: "#666", marginBottom: 12 }}>
          How Might We statements derived from Teacher NPS 2025 feedback categories. Same format as
          Design HMW; use for design discussions and click through to see NPS responses.
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
                        const cardKey = `${item.category}|${item.subCategory}|${item.themeId}`;
                        const copied = copiedId === cardKey;
                        return (
                        <li
                          key={cardKey}
                          style={{
                            padding: "12px 16px",
                            background: "#f6f8fa",
                            borderRadius: 8,
                            border: "1px solid #d0d7de",
                            position: "relative",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => copyCard(item)}
                            title="Copy card"
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
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
                            style={{ fontWeight: 600, color: "#24292f", marginBottom: 4, paddingRight: 36 }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                              marginBottom: 6,
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
                              {item.responseCount} NPS response
                              {item.responseCount === 1 ? "" : "s"}
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
                                {item.categorySharePct}% of {item.category} NPS
                              </span>
                            )}
                          </div>
                          {item.hmw && (
                            <p
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: 14,
                                color: "#24292f",
                                fontStyle: "italic",
                              }}
                            >
                              {item.hmw}
                            </p>
                          )}
                          <Link
                            href={buildNpsEvidenceUrl(item.category, item.subCategory)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              color: "#0969da",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                          >
                            <ExternalLink size={14} />
                            View evidence in NPS feedback
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
