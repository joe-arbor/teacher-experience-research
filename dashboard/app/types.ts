export interface FeedbackRow {
  ticket: string;
  issue_id: string;
  module: string;
  summary: string;
  role: string;
  source: string;
  comment: string;
  source_file: string;
  month: string;
  year: string;
  phase: string;
  journeys: string[];
  top_level_category: string;
  sub_category: string;
}

export type ValueToCustomer = "high" | "medium" | "low";

export interface ProblemTheme {
  category: string;
  subCategory: string;
  title: string;
  description: string;
  cardCount: number;
  valueToCustomer: ValueToCustomer;
}

/** Teacher NPS 2025 enriched row (from Teacher NPS feedback 2025_enriched.json). */
export interface NpsRow {
  "Company Name": string;
  "Company MAT Name": string;
  "Company MIS Support Provider": string;
  "Response Type (MAT/School)": string;
  "Responder Name": string;
  "Responder Role Group": string;
  "How likely are you to recommend?": string;
  "Arbor has improved the way I work": string;
  "Arbor makes analysing data easier": string;
  "Arbor saves me time": string;
  Comments: string;
  "NPS Shift": string;
  "Company Go Live Date": string;
  "Current Score Score": string;
  top_level_category: string;
  sub_category: string;
  theme_id: string;
}

/** Table row: parent = sub-category (total count); child = theme (theme count). */
export interface ProblemRow {
  type: "parent" | "child";
  category: string;
  subCategory: string;
  _key: string;
  /** Parent: sub-category total. Child: theme count. */
  cardCount: number;
  /** Parent only. */
  valueToCustomer?: ValueToCustomer;
  description?: string;
  /** Parent: sub-category name. Child: theme label. */
  label: string;
  /** Child only. */
  themeId?: string;
}
