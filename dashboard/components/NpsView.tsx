"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { Select } from "baseui/select";
import { SELECT_FORM_FIELD_OVERRIDES } from "@/components/FormField";
import type { NpsRow } from "@/app/types";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management", "Uncategorised"] as const;

function filterData(
  data: NpsRow[],
  filters: { category: string | null; subCategory: string | null }
): NpsRow[] {
  let out = data;
  if (filters.category) out = out.filter((r) => r.top_level_category === filters.category);
  if (filters.subCategory) out = out.filter((r) => r.sub_category === filters.subCategory);
  return out;
}

function npsScore(row: NpsRow): number | null {
  const s = row["How likely are you to recommend?"]?.trim();
  if (s === "" || s === undefined) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function averageNps(rows: NpsRow[]): number | null {
  const scores = rows.map(npsScore).filter((n): n is number => n !== null);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export default function NpsView() {
  const themeReady = useThemeReady();
  const [data, setData] = useState<NpsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/nps_feedback_2025.json")
      .then((res) => res.json())
      .then((json: unknown) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterData(data, { category, subCategory }),
    [data, category, subCategory]
  );

  const subCategoriesForCategory = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => {
      if (category && r.top_level_category !== category) return;
      if (r.sub_category) set.add(r.sub_category);
    });
    return Array.from(set).sort();
  }, [data, category]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      if (category && r.top_level_category !== category) return;
      const key = r.sub_category || "Uncategorised";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [data, category]);

  const handleChartBarClick = useCallback((payload: { name?: string }) => {
    if (!payload?.name) return;
    setSubCategory((current) => (current === payload.name ? null : payload.name ?? null));
  }, []);

  const showingLabel = useMemo(() => {
    if (!category && !subCategory) return "All";
    if (category && subCategory) return `${category} › ${subCategory}`;
    return (category || subCategory) ?? "All";
  }, [category, subCategory]);

  const totalResponses = filtered.length;
  const withComment = filtered.filter((r) => (r.Comments || "").trim().length > 0).length;
  const avgNps = averageNps(filtered);

  if (!themeReady || loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        {!themeReady ? "Loading…" : "Loading NPS data…"}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: 0, padding: "24px 16px", boxSizing: "border-box" }}>
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>Teacher NPS feedback 2025</Heading>
        <p style={{ color: "#666", marginBottom: 24 }}>
          NPS survey responses with category and theme from comment text. Filter by category or sub-category.
        </p>
      </HeadingLevel>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 24, alignItems: "flex-end" }}>
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", background: "#ffffff", borderRadius: 8, border: "1px solid #d0d7de", minWidth: 140 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#24292f" }}>{totalResponses}</div>
          <div style={{ fontSize: 12, color: "#57606a", marginTop: 4 }}>Total responses</div>
        </div>
        <div style={{ padding: "16px 20px", background: "#ffffff", borderRadius: 8, border: "1px solid #d0d7de", minWidth: 140 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#24292f" }}>{avgNps ?? "—"}</div>
          <div style={{ fontSize: 12, color: "#57606a", marginTop: 4 }}>Average NPS (0–10)</div>
        </div>
        <div style={{ padding: "16px 20px", background: "#ffffff", borderRadius: 8, border: "1px solid #d0d7de", minWidth: 140 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#24292f" }}>{withComment}</div>
          <div style={{ fontSize: 12, color: "#57606a", marginTop: 4 }}>With comments</div>
        </div>
      </div>

      <div style={{ width: "100%", marginBottom: 24 }}>
        <div style={{ width: "100%", height: 320 }}>
          <h3 style={{ marginBottom: 8 }}>
            By sub-category
            {category ? ` – ${category}` : ""}
            {" "}(click to filter)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeef2" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#24292f"
                radius={[4, 4, 0, 0]}
                onClick={handleChartBarClick}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Showing categories: {showingLabel}</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filtered.map((row, idx) => {
          const score = npsScore(row);
          const comment = (row.Comments || "").trim() || "(No comment)";
          return (
            <li
              key={`${row["Company Name"]}-${row["Responder Name"]}-${idx}`}
              style={{
                marginBottom: 16,
                padding: 16,
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid #d0d7de",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", marginBottom: 8 }}>
                {score !== null && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#24292f",
                      background: score >= 7 ? "#dafbe1" : score >= 5 ? "#fff8c5" : "#ffebe9",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    NPS {score}
                  </span>
                )}
                <span style={{ fontSize: 12, color: "#57606a" }}>{row["Company Name"]}</span>
                <span style={{ fontSize: 12, color: "#57606a" }}>{row["Responder Name"]} · {row["Responder Role Group"]}</span>
                <span style={{ fontSize: 11, color: "#0969da", background: "#ddf4ff", padding: "2px 6px", borderRadius: 4 }}>
                  {row.top_level_category}
                </span>
                {row.sub_category !== "Uncategorised" && (
                  <span style={{ fontSize: 11, color: "#57606a" }}>{row.sub_category}</span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#24292f", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                {comment}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
