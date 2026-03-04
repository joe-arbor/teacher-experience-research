"use client";

import type { FeedbackRow } from "@/app/types";

export function TicketList({
  data,
  onSelectTicket,
}: {
  data: FeedbackRow[];
  onSelectTicket: (row: FeedbackRow) => void;
}) {
  return (
    <div style={{ overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #d0d7de", textAlign: "left" }}>
            <th style={{ padding: "8px 12px" }}>Ticket</th>
            <th style={{ padding: "8px 12px" }}>Summary</th>
            <th style={{ padding: "8px 12px" }}>Phase</th>
            <th style={{ padding: "8px 12px" }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 100).map((row) => (
            <tr
              key={row.ticket + row.issue_id}
              style={{ borderBottom: "1px solid #eaeef2", cursor: "pointer" }}
              onClick={() => onSelectTicket(row)}
            >
              <td style={{ padding: "8px 12px" }}>{row.ticket}</td>
              <td style={{ padding: "8px 12px", maxWidth: 400 }}>{(row.summary || "").slice(0, 80)}…</td>
              <td style={{ padding: "8px 12px" }}>{row.phase || "Both"}</td>
              <td style={{ padding: "8px 12px" }}>{row.top_level_category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 100 && (
        <p style={{ padding: 12, color: "#57606a", fontSize: 12 }}>Showing first 100 of {data.length} rows.</p>
      )}
    </div>
  );
}
