/**
 * Enriches Teacher NPS feedback 2025.csv with:
 * - top_level_category (Attendance & Registers | Behaviour Management | Classroom Management | Uncategorised)
 * - sub_category (e.g. "Seating plans and My Classroom" | "Uncategorised")
 * - theme_id (e.g. "seating-my-classroom" | "other")
 *
 * Formula (same as Jira feedback / Product problems):
 * 1. For each row, take the Comments text.
 * 2. Try each (category, sub_category) from PROBLEM_THEMES.
 * 3. For each pair, get themes and run keyword match: first theme (excluding Other) whose keyword appears in the text wins.
 * 4. If a non-Other theme matches, assign that category, sub_category, and theme_id.
 * 5. If no pair produces a non-Other match, assign top_level_category="Uncategorised", sub_category="Uncategorised", theme_id="other".
 */

import * as fs from "fs";
import * as path from "path";
import {
  PROBLEM_THEMES,
  getThemesForSubCategory,
  assignRowToTheme,
} from "../app/problemThemes";

const CSV_PATH = path.join(
  __dirname,
  "../../User Feedback/Teacher NPS feedback 2025.csv"
);
const OUT_JSON_PATH = path.join(
  __dirname,
  "../../User Feedback/Teacher NPS feedback 2025_enriched.json"
);
const OUT_CSV_PATH = path.join(
  __dirname,
  "../../User Feedback/Teacher NPS feedback 2025_enriched.csv"
);

/** Parse a single CSV line respecting quoted fields (handles commas inside quotes). */
function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = i + 1;
      while (end < line.length) {
        const next = line.indexOf('"', end);
        if (next === -1) break;
        if (line[next + 1] === '"') {
          end = next + 2;
          continue;
        }
        out.push(
          line
            .slice(i + 1, next)
            .replace(/""/g, '"')
        );
        end = next + 1;
        break;
      }
      i = end;
      if (line[i] === ",") i++;
      continue;
    }
    const comma = line.indexOf(",", i);
    if (comma === -1) {
      out.push(line.slice(i).trim());
      break;
    }
    out.push(line.slice(i, comma).trim());
    i = comma + 1;
  }
  return out;
}

function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map((l) => parseCSVLine(l));
  return { headers, rows };
}

function rowToObject(headers: string[], values: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    obj[h] = values[i] ?? "";
  });
  return obj;
}

function escapeCSV(val: string): string {
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

function main() {
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const { headers, rows } = parseCSV(raw);

  const categorySubByKey = Object.keys(PROBLEM_THEMES).map((k) => {
    const [category, subCategory] = k.split("|");
    return { key: k, category, subCategory };
  });

  const enriched: Record<string, unknown>[] = [];
  for (const values of rows) {
    const row = rowToObject(headers, values);
    const comment = (row["Comments"] ?? "").trim();
    const text = comment;

    let top_level_category = "Uncategorised";
    let sub_category = "Uncategorised";
    let theme_id = "other";

    for (const { category, subCategory } of categorySubByKey) {
      const themes = getThemesForSubCategory(category, subCategory);
      const themeId = assignRowToTheme(
        { comment: text, summary: "" },
        themes
      );
      if (themeId !== "other") {
        top_level_category = category;
        sub_category = subCategory;
        theme_id = themeId;
        break;
      }
    }

    enriched.push({
      ...row,
      top_level_category,
      sub_category,
      theme_id,
    });
  }

  fs.writeFileSync(OUT_JSON_PATH, JSON.stringify(enriched, null, 2), "utf-8");
  console.log(`Wrote ${enriched.length} rows to ${OUT_JSON_PATH}`);

  const outHeaders = [
    ...headers,
    "top_level_category",
    "sub_category",
    "theme_id",
  ];
  const csvLines = [
    outHeaders.map(escapeCSV).join(","),
    ...enriched.map((r) =>
      outHeaders.map((h) => escapeCSV(String((r as Record<string, string>)[h] ?? ""))).join(",")
    ),
  ];
  fs.writeFileSync(OUT_CSV_PATH, csvLines.join("\n"), "utf-8");
  console.log(`Wrote ${OUT_CSV_PATH}`);
}

main();
