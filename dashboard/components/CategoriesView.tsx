"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { Select } from "baseui/select";
import { SELECT_FORM_FIELD_OVERRIDES } from "@/components/FormField";
import { SummaryCards } from "@/components/SummaryCards";
import { SubCategoryChart } from "@/components/PhaseJourneyCharts";
import { FeedbackTiles } from "@/components/FeedbackTiles";
import { TicketDetailModal } from "@/components/TicketDetailModal";
import { AskSection } from "@/components/AskSection";
import type { FeedbackRow } from "@/app/types";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management"] as const;

function filterData(
  data: FeedbackRow[],
  filters: {
    category: string | null;
    subCategory: string | null;
  }
): FeedbackRow[] {
  let out = data;
  if (filters.category) out = out.filter((r) => r.top_level_category === filters.category);
  if (filters.subCategory) out = out.filter((r) => r.sub_category === filters.subCategory);
  return out;
}

export default function CategoriesView() {
  const themeReady = useThemeReady();
  const searchParams = useSearchParams();
  const [data, setData] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<FeedbackRow | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    const cat = searchParams.get("category");
    const sub = searchParams.get("sub");
    if (cat) setCategory(cat);
    if (sub) setSubCategory(sub);
  }, [searchParams]);

  useEffect(() => {
    fetch("/teacher_experience_data.json")
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
      if (!CATEGORIES.includes(r.top_level_category as (typeof CATEGORIES)[number])) return;
      if (category && r.top_level_category !== category) return;
      if (r.sub_category && r.sub_category !== "Uncategorised") set.add(r.sub_category);
    });
    return Array.from(set).sort();
  }, [data, category]);

  const handleAsk = useCallback(
    async (question: string) => {
      setAskLoading(true);
      setAskAnswer(null);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            contextCategory: category,
            contextSubCategory: subCategory,
          }),
        });
        const json = await res.json();
        setAskAnswer(json.answer ?? json.error ?? "No response.");
      } catch (e) {
        setAskAnswer("Request failed. Set OPENAI_API_KEY for AI answers.");
      } finally {
        setAskLoading(false);
      }
    },
    [category, subCategory]
  );

  const askContextLabel = useMemo(() => {
    const parts: string[] = [];
    if (category) parts.push(category);
    if (subCategory) parts.push(subCategory);
    return parts.length ? parts.join(" → ") : "All teacher experience feedback";
  }, [category, subCategory]);

  const showingCategoriesLabel = useMemo(() => {
    if (!category && !subCategory) return "All";
    if (category && subCategory) return `${category} › ${subCategory}`;
    return (category || subCategory) ?? "All";
  }, [category, subCategory]);

  if (!themeReady || loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        {!themeReady ? "Loading…" : "Loading teacher experience data…"}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: 0, padding: "24px 16px", boxSizing: "border-box" }}>
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>Category quotes</Heading>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Visualise feedback by category and sub-category. Tiles show comments only — click a tile to see full details and capture quotes.
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

      <SummaryCards data={filtered} />

      <div style={{ width: "100%", marginBottom: 24 }}>
        <SubCategoryChart
          data={data}
          category={category}
          selectedSubCategory={subCategory}
          onSelectSubCategory={(name) =>
            setSubCategory((current) => (current === name ? null : name))
          }
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Showing categories: {showingCategoriesLabel}</h3>
        <FeedbackTiles
          key={`${category ?? "all"}-${subCategory ?? "all"}`}
          data={filtered}
          onSelectTicket={setSelectedTicket}
        />
      </div>

      <AskSection
        onAsk={handleAsk}
        loading={askLoading}
        answer={askAnswer}
        contextLabel={askContextLabel}
      />

      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
}
