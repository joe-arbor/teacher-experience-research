"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { Select } from "baseui/select";
import { Button } from "baseui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SELECT_FORM_FIELD_OVERRIDES } from "@/components/FormField";
import { CategorySplitPieChart } from "@/components/CategorySplitPieChart";
import type { FeedbackRow } from "@/app/types";
import type { ProblemRow, ValueToCustomer } from "@/app/types";
import { getThemesForSubCategory, assignRowToTheme } from "@/app/problemThemes";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management"] as const;
const STORAGE_KEY = "problems-overrides";

function loadOverrides(): Record<string, { description?: string; valueToCustomer?: ValueToCustomer }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, { description?: string; valueToCustomer?: ValueToCustomer }>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {}
}

function defaultValueByTercile(cardCount: number, counts: number[]): ValueToCustomer {
  if (counts.length === 0) return "medium";
  const sorted = [...counts].sort((a, b) => b - a);
  const topThirdIdx = Math.floor(sorted.length / 3);
  const bottomThirdIdx = Math.floor((2 * sorted.length) / 3);
  const highThreshold = sorted[topThirdIdx] ?? 0;
  const lowThreshold = sorted[bottomThirdIdx] ?? 0;
  if (cardCount >= highThreshold) return "high";
  if (cardCount <= lowThreshold) return "low";
  return "medium";
}

export default function ProblemsView() {
  const themeReady = useThemeReady();
  const router = useRouter();
  const [data, setData] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, { description?: string; valueToCustomer?: ValueToCustomer }>>({});
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  useEffect(() => {
    fetch("/teacher_experience_data.json")
      .then((res) => res.json())
      .then((json: unknown) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const subCategoriesForCategory = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => {
      if (!CATEGORIES.includes(r.top_level_category as (typeof CATEGORIES)[number])) return;
      if (category && r.top_level_category !== category) return;
      if (r.sub_category && r.sub_category !== "Uncategorised") set.add(r.sub_category);
    });
    return Array.from(set).sort();
  }, [data, category]);

  const categoryPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      const c = r.top_level_category || "Uncategorised";
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [data]);

  const rows = useMemo(() => {
    const countByKey: Record<string, { category: string; subCategory: string; total: number; byTheme: Record<string, number> }> = {};
    data.forEach((r) => {
      if (!CATEGORIES.includes(r.top_level_category as (typeof CATEGORIES)[number])) return;
      if (r.sub_category && r.sub_category !== "Uncategorised") {
        const key = `${r.top_level_category}|${r.sub_category}`;
        if (!countByKey[key]) countByKey[key] = { category: r.top_level_category, subCategory: r.sub_category, total: 0, byTheme: {} };
        countByKey[key].total += 1;
        const themes = getThemesForSubCategory(r.top_level_category, r.sub_category);
        if (themes.length > 0) {
          const themeId = assignRowToTheme(r, themes);
          countByKey[key].byTheme[themeId] = (countByKey[key].byTheme[themeId] ?? 0) + 1;
        }
      }
    });
    const totals = Object.values(countByKey).map((x) => x.total);
    const out: ProblemRow[] = [];
    const entries = Object.entries(countByKey)
      .filter(([_, v]) => (!category || v.category === category) && (!subCategory || v.subCategory === subCategory))
      .sort((a, b) => b[1].total - a[1].total);
    for (const [key, { category: cat, subCategory: sub, total, byTheme }] of entries) {
      const o = overrides[key];
      const valueToCustomer = o?.valueToCustomer ?? defaultValueByTercile(total, totals);
      out.push({
        type: "parent",
        category: cat,
        subCategory: sub,
        _key: key,
        cardCount: total,
        valueToCustomer,
        description: o?.description ?? "",
        label: sub,
      });
      const themes = getThemesForSubCategory(cat, sub);
      if (themes.length > 0 && Object.keys(byTheme).length > 0) {
        const themeList = themes.filter((t) => byTheme[t.id] != null && byTheme[t.id] > 0);
        themeList.sort((a, b) => (byTheme[b.id] ?? 0) - (byTheme[a.id] ?? 0));
        for (const t of themeList) {
          const n = byTheme[t.id] ?? 0;
          if (n === 0) continue;
          out.push({
            type: "child",
            category: cat,
            subCategory: sub,
            _key: `${key}|${t.id}`,
            cardCount: n,
            label: t.label,
            themeId: t.id,
          });
        }
      }
    }
    return out;
  }, [data, overrides, category, subCategory]);

  const parentRows = useMemo(() => rows.filter((r) => r.type === "parent"), [rows]);
  const hasChildren = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.type === "child") set.add(r._key.split("|").slice(0, 2).join("|"));
    });
    return set;
  }, [rows]);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (!themeReady || loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        {!themeReady ? "Loading…" : "Loading…"}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: 0, padding: "24px 16px", boxSizing: "border-box" }}>
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>Product problems</Heading>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Problem themes by sub-category with card count. Expand a row to see themes. Use “View evidence” to see quotes.
        </p>
      </HeadingLevel>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <div style={{ minWidth: 200 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#24292f", marginBottom: 4 }}>Category</label>
              <Select
                overrides={SELECT_FORM_FIELD_OVERRIDES}
                options={[{ id: "__all__", label: "All categories" }, ...CATEGORIES.map((c) => ({ id: c, label: c }))]}
                value={category ? [{ id: category, label: category }] : [{ id: "__all__", label: "All categories" }]}
                onChange={({ value }) => {
                  const id = value[0]?.id as string;
                  setCategory(id && id !== "__all__" ? id : null);
                  setSubCategory(null);
                }}
                getOptionLabel={({ option }) => (option?.label as string) ?? ""}
                getValueLabel={({ option }) => (option?.label as string) ?? "All categories"}
                placeholder="All categories"
              />
            </div>
            <div style={{ minWidth: 220 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#24292f", marginBottom: 4 }}>Sub-category</label>
              <Select
                overrides={SELECT_FORM_FIELD_OVERRIDES}
                options={[{ id: "__all__", label: "All sub-categories" }, ...subCategoriesForCategory.map((s) => ({ id: s, label: s }))]}
                value={subCategory ? [{ id: subCategory, label: subCategory }] : [{ id: "__all__", label: "All sub-categories" }]}
                onChange={({ value }) => {
                  const id = value[0]?.id as string;
                  setSubCategory(id && id !== "__all__" ? id : null);
                }}
                getOptionLabel={({ option }) => (option?.label as string) ?? ""}
                getValueLabel={({ option }) => (option?.label as string) ?? "All sub-categories"}
                placeholder="All sub-categories"
              />
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", flexShrink: 0, minWidth: 380 }}>
          <CategorySplitPieChart data={categoryPieData} />
        </div>
      </div>

      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #d0d7de", textAlign: "left" }}>
              <th style={{ padding: "8px 12px", width: 32 }} />
              <th style={{ padding: "8px 12px" }}>Problem</th>
              <th style={{ padding: "8px 12px" }}>Sub-category or theme</th>
              <th style={{ padding: "8px 12px" }}>Category</th>
              <th style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>Cards</th>
              <th style={{ padding: "8px 12px" }} />
            </tr>
          </thead>
          <tbody>
            {parentRows.map((parent) => {
              const isExpanded = expandedKeys.has(parent._key);
              const children = rows.filter((r) => r.type === "child" && r._key.startsWith(parent._key + "|"));
              const showChildren = hasChildren.has(parent._key) && isExpanded;
              return (
                <React.Fragment key={parent._key}>
                  <tr style={{ borderBottom: "1px solid #eaeef2", background: "#fff" }}>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle" }}>
                      {hasChildren.has(parent._key) ? (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(parent._key)}
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            padding: 4,
                            fontSize: 14,
                          }}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      ) : (
                        <span style={{ display: "inline-block", width: 22 }} />
                      )}
                    </td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{parent.label}</td>
                    <td style={{ padding: "8px 12px" }}>{parent.subCategory}</td>
                    <td style={{ padding: "8px 12px" }}>{parent.category}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ fontWeight: 600, color: "#24292f" }}>{parent.cardCount}</span>
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <Button
                        kind="tertiary"
                        size="compact"
                        onClick={() =>
                          router.push(
                            `/categories?category=${encodeURIComponent(parent.category)}&sub=${encodeURIComponent(parent.subCategory)}`
                          )
                        }
                      >
                        View evidence
                      </Button>
                    </td>
                  </tr>
                  {showChildren &&
                    children.map((child) => {
                      const themeDef = getThemesForSubCategory(child.category, child.subCategory).find((t) => t.id === child.themeId);
                      const themeDescription = themeDef?.description;
                      return (
                        <tr key={child._key} style={{ borderBottom: "1px solid #eaeef2", background: "#f6f8fa" }}>
                          <td style={{ padding: "8px 12px" }} />
                          <td style={{ padding: "8px 12px" }} />
                          <td style={{ padding: "8px 12px", paddingLeft: 32, color: "#24292f", fontSize: 12 }}>
                            <div>{child.label}</div>
                            {themeDescription && (
                              <div style={{ marginTop: 4, color: "#57606a", fontWeight: 400, maxWidth: 420 }}>{themeDescription}</div>
                            )}
                          </td>
                          <td style={{ padding: "8px 12px", color: "#57606a" }}>{child.category}</td>
                          <td style={{ padding: "8px 12px" }}>
                            <span style={{ color: "#24292f" }}>{child.cardCount}</span>
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            {child.themeId && (
                              <Button
                                kind="tertiary"
                                size="compact"
                                onClick={() =>
                                  router.push(
                                    `/categories?category=${encodeURIComponent(child.category)}&sub=${encodeURIComponent(child.subCategory)}&theme=${encodeURIComponent(child.themeId ?? "")}`
                                  )
                                }
                              >
                                View evidence
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {parentRows.length === 0 && (
        <p style={{ padding: 24, color: "#57606a" }}>No problem themes match the current filters.</p>
      )}
    </div>
  );
}
