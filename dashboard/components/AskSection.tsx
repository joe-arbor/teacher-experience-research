"use client";

import { useState } from "react";

export function AskSection({
  onAsk,
  loading,
  answer,
  contextLabel,
}: {
  onAsk: (question: string) => void;
  loading: boolean;
  answer: string | null;
  contextLabel: string;
}) {
  const [question, setQuestion] = useState("");

  return (
    <div style={{ marginTop: 24, padding: 20, background: "#f6f8fa", borderRadius: 8, border: "1px solid #eaeef2" }}>
      <h3 style={{ margin: "0 0 8px" }}>Ask about this data</h3>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "#57606a" }}>Context: {contextLabel}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What are the main themes in Behaviour feedback?"
          disabled={loading}
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 14 }}
        />
        <button
          type="button"
          onClick={() => { onAsk(question); setQuestion(""); }}
          disabled={loading || !question.trim()}
          style={{ padding: "8px 16px", background: "#24292f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Ask
        </button>
      </div>
      {answer != null && (
        <div style={{ marginTop: 12, padding: 12, background: "#fff", borderRadius: 6, fontSize: 13, whiteSpace: "pre-wrap" }}>
          {answer}
        </div>
      )}
    </div>
  );
}
