"use client";

import { useMemo, useState } from "react";
import { CHANGELOG_ENTRIES } from "./entries";
import { CHANGELOG_CATEGORIES, type ChangelogCategory, type ChangelogEntry } from "./types";

type FilterValue = ChangelogCategory | "All";
type SortOrder = "new-to-old" | "old-to-new";

/** Sortable key: date + time (ISO-like so string compare works). */
function sortKey(entry: ChangelogEntry): string {
  const t = entry.time ?? "00:00";
  return `${entry.date}T${t}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(dateStr: string, timeStr?: string): string {
  const datePart = formatDate(dateStr);
  if (!timeStr) return datePart;
  return `${datePart}, ${timeStr}`;
}

export default function ChangelogPage() {
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old");

  const filtered = useMemo(() => {
    const list =
      categoryFilter === "All"
        ? [...CHANGELOG_ENTRIES]
        : CHANGELOG_ENTRIES.filter(
            (e) => e.category.trim() === categoryFilter.trim()
          );
    const cmp =
      sortOrder === "new-to-old"
        ? (a: ChangelogEntry, b: ChangelogEntry) =>
            sortKey(b).localeCompare(sortKey(a))
        : (a: ChangelogEntry, b: ChangelogEntry) =>
            sortKey(a).localeCompare(sortKey(b));
    return [...list].sort(cmp);
  }, [categoryFilter, sortOrder]);

  return (
    <div style={{ padding: "32px 24px 48px", maxWidth: 900, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#24292f" }}>
          Changelog
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#57606a" }}>
          Decisions and changes made while building this product
        </p>
      </header>

      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end" }}>
        <div>
          <label
            htmlFor="changelog-filter"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#24292f",
              marginBottom: 8,
            }}
          >
            Category
          </label>
          <select
            id="changelog-filter"
            value={categoryFilter}
            onChange={(e) => {
              const value = e.currentTarget.value as FilterValue;
              setCategoryFilter(value);
            }}
            className="form-field"
            style={{
              padding: "8px 12px",
              fontSize: 14,
              minWidth: 220,
            }}
          >
            <option value="All">All</option>
            {CHANGELOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="changelog-sort"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#24292f",
              marginBottom: 8,
            }}
          >
            Sort
          </label>
          <select
            id="changelog-sort"
            value={sortOrder}
            onChange={(e) => {
              const value = e.currentTarget.value as SortOrder;
              setSortOrder(value);
            }}
            className="form-field"
            style={{
              padding: "8px 12px",
              fontSize: 14,
              minWidth: 160,
            }}
          >
            <option value="new-to-old">Newest first</option>
            <option value="old-to-new">Oldest first</option>
          </select>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filtered.map((entry: ChangelogEntry) => (
          <li
            key={entry.id}
            style={{
              marginBottom: 20,
              padding: 20,
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #d0d7de",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px 12px",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#57606a",
                  letterSpacing: "0.05em",
                }}
              >
                {formatDateTime(entry.date, entry.time)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0969da",
                  background: "#ddf4ff",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {entry.category}
              </span>
            </div>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 16,
                fontWeight: 600,
                color: "#24292f",
              }}
            >
              {entry.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#24292f",
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}
            >
              {entry.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
