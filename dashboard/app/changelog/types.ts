export const CHANGELOG_CATEGORIES = [
  "Project decision",
  "Build / technical",
  "UI / design",
  "Data / content",
  "Bug fix",
] as const;

export type ChangelogCategory = (typeof CHANGELOG_CATEGORIES)[number];

export interface ChangelogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm, optional for backwards compatibility
  category: ChangelogCategory;
  title: string;
  body: string; // 1–2 sentences or short bullets; can use \n for line breaks
  tags?: string[]; // optional e.g. ["dashboard", "filters"]
}
