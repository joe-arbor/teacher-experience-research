"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { FeedbackRow } from "@/app/types";

const CORE_CATEGORIES = [
  "Attendance & Registers",
  "Behaviour Management",
  "Classroom Management",
] as const;

export function SubCategoryChart({
  data,
  selectedSubCategory,
  onSelectSubCategory,
  category,
}: {
  data: FeedbackRow[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (subCategory: string | null) => void;
  category: string | null;
}) {
  const rows = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      // Only include rows from the three core categories
      if (!CORE_CATEGORIES.includes(r.top_level_category as (typeof CORE_CATEGORIES)[number])) {
        return;
      }
      if (category && r.top_level_category !== category) return;
      if (!r.sub_category || r.sub_category === "Uncategorised") return;
      const key = r.sub_category;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [data, category]);

  const handleClick = (payload: { name?: string }) => {
    if (!payload?.name) return;
    if (payload.name === selectedSubCategory) {
      onSelectSubCategory(null);
    } else {
      onSelectSubCategory(payload.name);
    }
  };

  return (
    <div style={{ width: "100%", height: 320 }}>
      <h3 style={{ marginBottom: 8 }}>
        By sub-category
        {category ? ` – ${category === "Classroom Management" ? "Classroom Management & Seating Plans" : category}` : ""}
        {" "} (click to filter)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeef2" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#24292f"
            radius={[4, 4, 0, 0]}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
