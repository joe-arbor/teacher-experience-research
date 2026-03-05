/**
 * Per-session filter persistence. Filters are stored in sessionStorage
 * so they are remembered while the tab is open and reset when it is closed.
 */

const STORAGE_KEY = "pds-filters";

export interface SessionFilters {
  category: string | null;
  subCategory: string | null;
  theme: string | null;
}

export function getSessionFilters(): SessionFilters {
  if (typeof window === "undefined") {
    return { category: null, subCategory: null, theme: null };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { category: null, subCategory: null, theme: null };
    const o = JSON.parse(raw) as Record<string, unknown>;
    return {
      category: (o.category as string) ?? null,
      subCategory: (o.subCategory as string) ?? null,
      theme: (o.theme as string) ?? null,
    };
  } catch {
    return { category: null, subCategory: null, theme: null };
  }
}

export function setSessionFilters(f: SessionFilters): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  } catch {}
}
