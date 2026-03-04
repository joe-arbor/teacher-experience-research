"use client";

import type { FeedbackRow } from "@/app/types";

export function TicketDetailModal({
  ticket,
  onClose,
}: {
  ticket: FeedbackRow | null;
  onClose: () => void;
}) {
  if (!ticket) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          maxWidth: 560,
          maxHeight: "80vh",
          overflow: "auto",
          padding: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>{ticket.ticket} — {ticket.summary || "(No summary)"}</h3>
          <button type="button" onClick={onClose} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
          <div><strong>Module:</strong> {ticket.module}</div>
          <div><strong>Category:</strong> {ticket.top_level_category}</div>
          <div><strong>Sub-category:</strong> {ticket.sub_category}</div>
          <div><strong>Phase:</strong> {ticket.phase}</div>
          <div><strong>Journeys:</strong> {(ticket.journeys || []).join(", ") || "—"}</div>
          <div><strong>Role:</strong> {ticket.role}</div>
          <div><strong>Source file:</strong> {ticket.source_file}</div>
          <div><strong>Date:</strong> {ticket.month} {ticket.year}</div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eaeef2" }}>
          <strong>Comment</strong>
          <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{ticket.comment || "(No comment)"}</p>
        </div>
      </div>
    </div>
  );
}
