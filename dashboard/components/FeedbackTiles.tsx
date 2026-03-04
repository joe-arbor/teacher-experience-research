"use client";

import { useState, useCallback, useRef } from "react";
import type { FeedbackRow } from "@/app/types";

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function FeedbackTiles({
  data,
  onSelectTicket,
}: {
  data: FeedbackRow[];
  onSelectTicket: (row: FeedbackRow) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      {data.map((row) => {
        const comment = (row.comment || "").trim() || "(No comment)";
        const copyText = `[${row.ticket}]\n\n${comment}`;
        return (
          <Tile
            key={row.ticket + row.issue_id}
            comment={comment}
            onCopy={() => navigator.clipboard?.writeText(copyText)}
            onOpen={() => onSelectTicket(row)}
          />
        );
      })}
    </div>
  );
}

function Tile({
  comment,
  onCopy,
  onOpen,
}: {
  comment: string;
  onCopy: () => void;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      onCopy();
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    },
    [onCopy]
  );

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #d0d7de",
        borderRadius: 8,
        background: "#ffffff",
        boxSizing: "border-box",
        transition: "border-color 0.15s, box-shadow 0.15s",
        borderColor: hover ? "#0969da" : "#d0d7de",
        boxShadow: hover ? "0 2px 8px rgba(9, 105, 218, 0.15)" : "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: hover || copied ? 1 : 0,
          transition: "opacity 0.15s",
          zIndex: 1,
        }}
      >
        {copied ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1a7f37" }}>Copied!</span>
        ) : null}
        <button
          type="button"
          onClick={handleCopy}
          title="Copy ticket and comment"
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: hover ? "#eaeef2" : "transparent",
            borderRadius: 6,
            cursor: "pointer",
            color: "#57606a",
            transition: "background 0.15s",
          }}
        >
          <CopyIcon size={14} />
        </button>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        style={{
          padding: 16,
          paddingRight: 44,
          textAlign: "left",
          cursor: "pointer",
          minHeight: "1em",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.5,
            color: "#24292f",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment}
        </p>
      </div>
    </div>
  );
}
