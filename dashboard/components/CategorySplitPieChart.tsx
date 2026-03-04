"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  "Attendance & Registers": "#0969da",
  "Behaviour Management": "#9a6700",
  "Classroom Management": "#1a7f37",
  Uncategorised: "#848d97",
};

function getColor(name: string): string {
  return CATEGORY_COLORS[name] ?? "#6e7781";
}

export interface CategorySplitPieChartProps {
  /** Category name -> count */
  data: { name: string; count: number }[];
  title?: string;
}

export function CategorySplitPieChart({ data: rawData, title = "Overview by category" }: CategorySplitPieChartProps) {
  const data = useMemo(() => {
    const total = rawData.reduce((s, d) => s + d.count, 0);
    if (total === 0) return [];
    return rawData
      .map((d) => ({
        name: d.name,
        count: d.count,
        value: d.count,
        percentage: Math.round((d.count / total) * 1000) / 10,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [rawData]);

  if (data.length === 0) return null;

  return (
    <div style={{ width: "100%", marginBottom: 24, flexShrink: 0, overflow: "visible" }}>
      <div style={{ width: "100%", maxWidth: 380, minWidth: 320, overflow: "visible" }}>
        <h3 style={{ marginBottom: 24, fontSize: 14, fontWeight: 600, color: "#24292f" }}>{title}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 64, right: 28, bottom: 60, left: 28 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={2}
              label={({ percentage }) => `${percentage}%`}
              labelLine={{ stroke: "#57606a", strokeWidth: 1 }}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name: string, props: { payload: { count: number; percentage: number } }) => {
                const p = props.payload;
                return [`${p.count} (${p.percentage}%)`, "Count"];
              }}
            />
            <Legend
              layout="vertical"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 12 }}
              formatter={(value) => {
                const item = data.find((d) => d.name === value);
                return item ? `${value} (${item.percentage}%)` : value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
