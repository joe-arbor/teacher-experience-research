"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { Select } from "baseui/select";
import { SELECT_FORM_FIELD_OVERRIDES } from "@/components/FormField";
import { SummaryCards } from "@/components/SummaryCards";
import { SubCategoryChart } from "@/components/PhaseJourneyCharts";
import { CategorySplitPieChart } from "@/components/CategorySplitPieChart";
import { FeedbackTiles } from "@/components/FeedbackTiles";
import { TicketDetailModal } from "@/components/TicketDetailModal";
import { AskSection } from "@/components/AskSection";
import type { FeedbackRow } from "@/app/types";
import { getThemesForSubCategory, assignRowToTheme } from "@/app/problemThemes";
import { getSessionFilters, setSessionFilters } from "@/app/filterSession";

const CATEGORIES = ["Attendance & Registers", "Behaviour Management", "Classroom Management"] as const;

function filterData(
  data: FeedbackRow[],
  filters: {
    category: string | null;
    subCategory: string | null;
    theme: string | null;
    roles: string[];
  }
): FeedbackRow[] {
  let out = data;
  if (filters.category) out = out.filter((r) => r.top_level_category === filters.category);
  if (filters.subCategory) out = out.filter((r) => r.sub_category === filters.subCategory);
  if (filters.theme && filters.category && filters.subCategory) {
    const themes = getThemesForSubCategory(filters.category, filters.subCategory);
    if (themes.length > 0) out = out.filter((r) => assignRowToTheme(r, themes) === filters.theme);
  }
  if (filters.roles.length > 0) out = out.filter((r) => filters.roles.includes(r.role));
  return out;
}

export default function CategoriesView() {
  const themeReady = useThemeReady();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<FeedbackRow | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    const cat = searchParams.get("category");
    const sub = searchParams.get("sub");
    const th = searchParams.get("theme");
    if (cat || sub || (th && th.trim())) {
      setCategory(cat || null);
      setSubCategory(sub || null);
      setTheme(th && th.trim() ? th : null);
    } else {
      const s = getSessionFilters();
      setCategory(s.category);
      setSubCategory(s.subCategory);
      setTheme(s.theme);
    }
  }, [searchParams]);

  useEffect(() => {
    setSessionFilters({ category, subCategory, theme });
  }, [category, subCategory, theme]);

  useEffect(() => {
    fetch("/teacher_experience_data.json")
      .then((res) => res.json())
      .then((json: unknown) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const themesForFilter = useMemo(() => {
    if (!category || !subCategory) return [];
    return getThemesForSubCategory(category, subCategory);
  }, [category, subCategory]);

  const filtered = useMemo(
    () => filterData(data, { category, subCategory, theme, roles }),
    [data, category, subCategory, theme, roles]
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

  const categoryPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      const c = r.top_level_category || "Uncategorised";
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [data]);

  const rolesForFilter = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => {
      if (!CATEGORIES.includes(r.top_level_category as (typeof CATEGORIES)[number])) return;
      if (category && r.top_level_category !== category) return;
      if (subCategory && r.sub_category !== subCategory) return;
      if (r.role && r.role.trim()) set.add(r.role);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data, category, subCategory]);

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
    const parts: string[] = [];
    if (category) parts.push(category);
    if (subCategory) parts.push(subCategory);
    if (theme) {
      const def = themesForFilter.find((t) => t.id === theme);
      parts.push(def?.label ?? theme);
    }
    if (roles.length > 0) parts.push(`Roles: ${roles.join(", ")}`);
    return parts.length ? parts.join(" › ") : "All";
  }, [category, subCategory, theme, themesForFilter, roles]);

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end", marginBottom: 24 }}>
            <div style={{ minWidth: 200 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#24292f", marginBottom: 4 }}>Category</label>
              <Select
                overrides={SELECT_FORM_FIELD_OVERRIDES}
                options={[{ id: "__all__", label: "All categories" }, ...CATEGORIES.map((c) => ({ id: c, label: c }))]}
                value={category ? [{ id: category, label: category }] : [{ id: "__all__", label: "All categories" }]}
                onChange={({ value }) => {
                  const id = value[0]?.id as string;
                  const newCat = id && id !== "__all__" ? id : null;
                  setCategory(newCat);
                  setSubCategory(null);
                  setTheme(null);
                  const params = new URLSearchParams();
                  if (newCat) params.set("category", newCat);
                  router.replace(params.toString() ? `/categories?${params.toString()}` : "/categories");
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
                  const newSub = id && id !== "__all__" ? id : null;
                  setSubCategory(newSub);
                  setTheme(null);
                  const params = new URLSearchParams();
                  if (category) params.set("category", category);
                  if (newSub) params.set("sub", newSub);
                  router.replace(params.toString() ? `/categories?${params.toString()}` : "/categories");
                }}
                getOptionLabel={({ option }) => (option?.label as string) ?? ""}
                getValueLabel={({ option }) => (option?.label as string) ?? "All sub-categories"}
                placeholder="All sub-categories"
              />
            </div>
            <div style={{ minWidth: 220 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#24292f", marginBottom: 4 }}>Role</label>
              <Select
                overrides={SELECT_FORM_FIELD_OVERRIDES}
                multi
                options={rolesForFilter.map((r) => ({ id: r, label: r }))}
                value={roles.map((r) => ({ id: r, label: r }))}
                onChange={({ value }) => {
                  setRoles((value ?? []).map((v) => v.id as string));
                }}
                getOptionLabel={({ option }) => (option?.label as string) ?? ""}
                getValueLabel={({ option }) => (option?.label as string) ?? ""}
                placeholder="All roles"
              />
            </div>
            {themesForFilter.length > 0 && (
              <div style={{ minWidth: 220 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#24292f", marginBottom: 4 }}>Theme</label>
                <Select
                  overrides={SELECT_FORM_FIELD_OVERRIDES}
                  options={[{ id: "__all__", label: "All themes" }, ...themesForFilter.map((t) => ({ id: t.id, label: t.label }))]}
                  value={theme ? [{ id: theme, label: themesForFilter.find((t) => t.id === theme)?.label ?? theme }] : [{ id: "__all__", label: "All themes" }]}
                  onChange={({ value }) => {
                    const id = value[0]?.id as string;
                    const newTheme = id && id !== "__all__" ? id : null;
                    setTheme(newTheme);
                    if (category && subCategory) {
                      const params = new URLSearchParams({ category, sub: subCategory });
                      if (newTheme) params.set("theme", newTheme);
                      router.replace(`/categories?${params.toString()}`);
                    }
                  }}
                  getOptionLabel={({ option }) => (option?.label as string) ?? ""}
                  getValueLabel={({ option }) => (option?.label as string) ?? "All themes"}
                  placeholder="All themes"
                />
              </div>
            )}
          </div>
          <SummaryCards data={filtered} />
        </div>
        <div style={{ marginLeft: "auto", flexShrink: 0, minWidth: 380 }}>
          <CategorySplitPieChart data={categoryPieData} />
        </div>
      </div>

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
