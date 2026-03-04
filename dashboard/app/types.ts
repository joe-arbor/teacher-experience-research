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
