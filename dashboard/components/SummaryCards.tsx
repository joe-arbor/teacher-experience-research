"use client";

import type { FeedbackRow } from "@/app/types";

export function SummaryCards({ data }: { data: FeedbackRow[] }) {
  const total = data.length;
  const withComment = data.filter((r) => (r.comment || "").trim().length > 0).length;
  const phases = new Set(data.map((r) => r.phase || "Both")).size;

  const cards = [
    { label: "Total feedback items", value: total },
    { label: "With comments", value: withComment },
    { label: "Phases represented", value: phases },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            padding: "16px 20px",
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #d0d7de",
            minWidth: 160,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#24292f" }}>{c.value}</div>
          <div style={{ fontSize: 12, color: "#57606a", marginTop: 4 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
