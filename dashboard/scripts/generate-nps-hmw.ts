/**
 * Generates NPS-derived How Might We statements from Teacher NPS 2025 feedback.
 * Follows .cursor/skills/hmw-writing-expert: "How might we [Action] for [User] so that they can [Outcome]?"
 * Run from dashboard/: npx ts-node scripts/generate-nps-hmw.ts (or tsx)
 * Output: app/npsHmwStatements.ts
 */

import * as fs from "fs";
import * as path from "path";

const NPS_JSON_PATH = path.join(__dirname, "../public/nps_feedback_2025.json");
const PROBLEM_THEMES_PATH = path.join(__dirname, "../app/problemThemes.ts");
const OUT_TS_PATH = path.join(__dirname, "../app/npsHmwStatements.ts");

interface NpsRow {
  top_level_category: string;
  sub_category: string;
  theme_id: string;
  Comments?: string;
  "Responder Role Group"?: string;
}

/** Inferred user group from category for NPS HMW (HMW writing expert: be specific about the user). */
function userForCategory(category: string): string {
  if (category === "Attendance & Registers") return "attendance staff and office teams";
  if (category === "Behaviour Management") return "teachers and behaviour teams";
  if (category === "Classroom Management") return "classroom teachers and staff";
  return "teachers and school staff";
}

/** Action verbs (HMW writing expert: vary the benefits and phrasing). */
const ACTION_VERBS = [
  "improve",
  "simplify",
  "surface",
  "make it easier to manage",
  "support",
  "streamline",
  "clarify",
  "strengthen",
];

/** Outcome starters for "so that they can ..." (outcome-focused, not problem restatement). */
const OUTCOME_PATTERNS: Record<string, string> = {
  "Attendance & Registers": "spend less time on admin and more time supporting pupils and staff",
  "Behaviour Management": "focus on teaching and pastoral support instead of fighting the system",
  "Classroom Management": "teach and take registers with confidence and minimal friction",
};

function getThemeLabelAndDescription(
  category: string,
  subCategory: string,
  themeId: string,
  themesMap: Map<string, Array<{ id: string; label: string; description?: string }>>
): { label: string; description: string } {
  const key = `${category}|${subCategory}`;
  const themes = themesMap.get(key) ?? [];
  const theme = themes.find((t) => t.id === themeId);
  if (theme) return { label: theme.label, description: theme.description ?? theme.label };
  return { label: themeId, description: "" };
}

/** Build PROBLEM_THEMES map from the TS file (extract theme arrays). */
function loadProblemThemes(): Map<string, Array<{ id: string; label: string; description?: string }>> {
  const content = fs.readFileSync(PROBLEM_THEMES_PATH, "utf-8");
  const map = new Map<string, Array<{ id: string; label: string; description?: string }>>();
  const keyRe = /\[key\("([^"]+)",\s*"([^"]+)"\)\]:\s*\[/g;
  const themeRe = /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*description:\s*"([^"]*)"[^}]*\}/g;
  let match;
  while ((match = keyRe.exec(content)) !== null) {
    const cat = match[1];
    const sub = match[2];
    const key = `${cat}|${sub}`;
    const blockStart = match.index + match[0].length;
    const blockEnd = content.indexOf("],", blockStart);
    const block = content.slice(blockStart, blockEnd);
    const themes: Array<{ id: string; label: string; description?: string }> = [];
    let tm;
    themeRe.lastIndex = 0;
    while ((tm = themeRe.exec(block)) !== null) {
      if (tm[1] === "other") continue;
      themes.push({ id: tm[1], label: tm[2], description: tm[3] || undefined });
    }
    map.set(key, themes);
  }
  return map;
}

/** Generate one NPS-derived HMW following hmw-writing-expert formula. */
function generateNpsHmw(
  category: string,
  subCategory: string,
  themeId: string,
  label: string,
  description: string,
  index: number
): string {
  const user = userForCategory(category);
  const verb = ACTION_VERBS[index % ACTION_VERBS.length];
  const defaultOutcome =
    OUTCOME_PATTERNS[category] ?? "get the most from this part of the system without extra friction";
  const outcome =
    description && description.length > 20
      ? description.replace(/\.$/, "").toLowerCase().slice(0, 80) + " without unnecessary effort"
      : defaultOutcome;
  return `How might we ${verb} ${label.toLowerCase()} for ${user} so that they can ${outcome}?`;
}

function escapeForTs(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function main() {
  const npsRaw = fs.readFileSync(NPS_JSON_PATH, "utf-8");
  const npsRows: NpsRow[] = JSON.parse(npsRaw);

  const seen = new Set<string>();
  const keys: Array<{ category: string; subCategory: string; themeId: string }> = [];
  for (const row of npsRows) {
    const cat = row.top_level_category ?? "";
    const sub = row.sub_category ?? "";
    const theme = row.theme_id ?? "";
    if (cat === "Uncategorised" || sub === "Uncategorised" || theme === "other") continue;
    const key = `${cat}|${sub}|${theme}`;
    if (seen.has(key)) continue;
    seen.add(key);
    keys.push({ category: cat, subCategory: sub, themeId: theme });
  }

  const themesMap = loadProblemThemes();
  const statements: Record<string, string> = {};
  let idx = 0;
  for (const { category, subCategory, themeId } of keys) {
    const { label, description } = getThemeLabelAndDescription(
      category,
      subCategory,
      themeId,
      themesMap
    );
    const hmw = generateNpsHmw(category, subCategory, themeId, label, description, idx++);
    statements[`${category}|${subCategory}|${themeId}`] = hmw;
  }

  const lines = [
    `/**`,
    ` * NPS-derived How Might We statements (from Teacher NPS 2025 feedback categories).`,
    ` * Key format: "category|subCategory|themeId". Generated by: npm run generate-nps-hmw`,
    ` * Used alongside HMW_STATEMENTS on Design HMW as additional prompts.`,
    ` */`,
    ``,
    `export type HmwStatementsMap = Record<string, string>;`,
    ``,
    `export const HMW_STATEMENTS_NPS: HmwStatementsMap = {`,
    ...Object.entries(statements).map(
      ([k, v]) => `  "${escapeForTs(k)}": "${escapeForTs(v)}",`
    ),
    `};`,
    ``,
    `export function getNpsHmw(category: string, subCategory: string, themeId: string): string | undefined {`,
    `  return HMW_STATEMENTS_NPS[\`\${category}|\${subCategory}|\${themeId}\`];`,
    `}`,
  ];

  fs.writeFileSync(OUT_TS_PATH, lines.join("\n") + "\n", "utf-8");
  console.log(`Wrote ${Object.keys(statements).length} NPS HMW statements to app/npsHmwStatements.ts`);
}

main();
