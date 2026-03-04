/**
 * Theme definitions per sub-category for Product problems.
 * Assignment: first theme whose keyword matches (comment + summary, case-insensitive) wins; no match → Other.
 * Formula: use broad keywords (single meaningful words + phrases); put specific phrases before generic words.
 */
export interface ThemeDefinition {
  id: string;
  label: string;
  keywords: string[];
}

export type ProblemThemesMap = Record<string, ThemeDefinition[]>;

function key(category: string, subCategory: string): string {
  return `${category}|${subCategory}`;
}

export const PROBLEM_THEMES: ProblemThemesMap = {
  [key("Attendance & Registers", "Bulk edit and workflow")]: [
    { id: "friction", label: "Friction in bulk steps", keywords: ["bulk edit", "bulk update", "too many steps", "filters", "date and group", "add attendance notes", "marks", "steps", "filters for date"] },
    { id: "peripatetic", label: "Peripatetic / external staff", keywords: ["peripatetic", "paper registers", "external", "outside companies", "peripatetic teachers"] },
    { id: "latecomer", label: "Latecomer and monitoring", keywords: ["latecomer", "house teams", "N codes", "O codes", "absentees", "late", "monitoring attendance"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Pre-planned absence and notes")]: [
    { id: "notes-flow", label: "Notes not flowing to register", keywords: ["pulled through", "onto the register", "reason", "wedding", "ill", "notes", "register", "authorised", "show"] },
    { id: "overridden", label: "Planned marks overridden", keywords: ["overridden", "prior to the register", "set the mark", "teacher", "taking the register", "pre-set"] },
    { id: "fines", label: "Fines / unauthorised rules", keywords: ["fines", "unauthorised", "five days", "ten week", "3 days"] },
    { id: "ad-hoc", label: "Ad hoc interventions as absence", keywords: ["ad hoc", "intervention", "planned absence", "in school", "ad hoc intervention"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Codes and marks")]: [
    { id: "locking", label: "Locking / permissions", keywords: ["locking", "only attendance officer", "teachers can change", "lock", "permission", "change marks"] },
    { id: "custom-census", label: "Custom codes and census", keywords: ["custom", "DofE", "census", "map", "code", "attendance code"] },
    { id: "suspended", label: "Suspended registers", keywords: ["suspended", "incomplete registers", "suspension"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Clubs and wrap-around")]: [
    { id: "capacity", label: "Capacity and booking", keywords: ["full", "maximum", "book", "parents", "capacity", "booking", "pupil numbers"] },
    { id: "cancel", label: "Cancelling sessions", keywords: ["cancel", "cancelled", "weather", "staff illness", "session", "cancel a club"] },
    { id: "reporting", label: "Reporting and intervals", keywords: ["report", "session intervals", "end", "deleting", "intervals", "club"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Evacuation and emergency registers")]: [
    { id: "access", label: "Access and placement", keywords: ["homescreen", "path", "quick access", "Emergency Evacuation", "access", "evacuation"] },
    { id: "format", label: "Format and filtering", keywords: ["xlsx", "csv", "filter", "tutor group", "download", "format"] },
    { id: "display", label: "Display", keywords: ["bolder", "print", "visually impaired", "absent pupils", "print out"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Reporting and statistics")]: [
    { id: "meal", label: "Meal registers", keywords: ["meal", "weeks meal", "kitchen", "dinner", "lunch", "menu"] },
    { id: "persistent", label: "Persistent absence", keywords: ["persistent absence", "absentees", "persistent"] },
    { id: "percentage", label: "Attendance % on pages", keywords: ["attendance percentage", "absentees by date", "percentage", "attendance %"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Staff absence and cover")]: [
    { id: "udf", label: "UDFs on registers/dashboard", keywords: ["UDF", "reading age", "class register", "dashboard", "class dashboard"] },
    { id: "pastoral", label: "Pastoral notes visibility", keywords: ["pastoral notes", "visible", "pastoral"] },
    { id: "cover-split", label: "Cover splitting", keywords: ["splitting", "double lesson", "manually amend", "cover", "split"] },
    { id: "annual-leave", label: "Annual leave and holidays", keywords: ["annual leave", "52 weeks", "school holiday", "leave", "support staff"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Roll call and daily settings")]: [
    { id: "lunch-kitchen", label: "Lunch numbers and kitchen", keywords: ["kitchen", "lunch numbers", "lunch"] },
    { id: "notes-pupils", label: "Notes for individual pupils", keywords: ["notes", "individual pupils", "Pastoral Notes", "pupils", "notes for"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Attendance & Registers", "Notifications and acknowledgements")]: [
    { id: "sibling", label: "Sibling / household absence", keywords: ["sibling", "same household", "same date", "same reason", "siblings"] },
    { id: "alerts", label: "Absence notifications", keywords: ["notifications", "notify", "absence", "alert"] },
    { id: "notes-wipe", label: "Notes vs register", keywords: ["wipe", "notify the teacher", "notes", "register", "mark notes"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Behaviour incidents and logging")]: [
    { id: "changelog", label: "Changelogs and audit", keywords: ["changelog", "changed", "permission", "changelogs", "data including"] },
    { id: "student-visibility", label: "Student visibility", keywords: ["students can't see", "achievement points", "reasons", "behaviour incidents", "student", "see", "list of"] },
    { id: "mandatory", label: "Mandatory narrative", keywords: ["mandatory", "narrative", "make narrative"] },
    { id: "incidents-logging", label: "Incidents and logging workflow", keywords: ["incident", "log", "logging", "behaviour", "arbor behaviour"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Detentions")]: [
    { id: "session-blocking", label: "Session blocking", keywords: ["single pupil", "already assigned", "none of the pupils", "flag", "deselect", "assign", "session", "group of pupils"] },
    { id: "session-visibility", label: "Session visibility", keywords: ["100 days", "20 days", "upcoming detention", "days", "showing"] },
    { id: "student-copy", label: "Student/parent copy", keywords: ["student should", "copy of the email", "narrative", "reason behind", "email", "parent", "guardian"] },
    { id: "detention-workflow", label: "Detention workflow", keywords: ["detention", "set", "session"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Points and rewards")]: [
    { id: "student-view", label: "Student view / data on display", keywords: ["student view", "points", "display on the board", "data rules", "board", "view"] },
    { id: "bulk-upload", label: "Bulk upload", keywords: ["upload", "whole group", "individually", "bulk", "group of students"] },
    { id: "narrative", label: "Narrative mandatory", keywords: ["narrative", "reason", "shared with pupil", "mandatory"] },
    { id: "achievement", label: "Achievement points", keywords: ["achievement", "point", "reward", "positive"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Report cards and pastoral")]: [
    { id: "progress-timeline", label: "Progress timeline on report cards", keywords: ["progress timeline", "report card", "parents", "progress", "tracking report"] },
    { id: "notes-comm", label: "Notes in communications view", keywords: ["notes", "communications", "letters", "emails", "meetings", "communication"] },
    { id: "on-report", label: "On-report / structured monitoring", keywords: ["on-report", "report card", "track", "intervene", "monitoring", "on report"] },
    { id: "layout", label: "Report layout", keywords: ["landscape", "portrait", "one page", "orientation", "standard report"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Alerts and notifications")]: [
    { id: "tagging", label: "Tagging staff", keywords: ["tag", "notified", "class teacher", "tagging", "members of staff"] },
    { id: "student-notif", label: "Student notifications", keywords: ["student", "notification", "point", "given"] },
    { id: "cover-email", label: "Cover email default", keywords: ["cover", "default", "tick", "email notifications"] },
    { id: "suspension", label: "Suspension notification", keywords: ["suspension", "attachment", "Notify Guardians", "guardian"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Custom reports")]: [
    { id: "filter-share", label: "Behaviour filters and share", keywords: ["filter", "custom groups", "share", "custom report"] },
    { id: "suspension-stats", label: "Suspension stats", keywords: ["suspensions", "week by week", "misleading", "exclusion", "statistics"] },
    { id: "demographics", label: "Demographics", keywords: ["SEN", "PP", "demographic", "demographic info"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Permissions and visibility")]: [
    { id: "reg-date", label: "Reg group and date", keywords: ["no longer in the reg group", "left school", "academic year", "reg group", "transferred"] },
    { id: "split-pos-neg", label: "Split positive/negative", keywords: ["positive", "negative", "permission", "allocation", "allocate"] },
    { id: "teacher-name", label: "Teacher name on timetable", keywords: ["teacher", "timetable", "students see", "displayed teacher"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Behaviour Management", "Physical intervention and safeguarding")]: [
    { id: "record-pi", label: "Record all PI", keywords: ["physical intervention", "Restrictive", "legislation", "record", "PI"] },
    { id: "limit-access", label: "Limit access", keywords: ["safeguarding", "limit access", "behaviour log", "categories"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Seating plans and My Classroom")]: [
    { id: "redundant", label: "Removing/redundant layouts", keywords: ["redundant", "remove", "delete", "accidentally", "extra", "layout"] },
    { id: "customisation", label: "Customisation", keywords: ["custom notes", "font", "bigger", "exam candidate", "size", "option"] },
    { id: "data-on-layout", label: "Data on layout", keywords: ["UDF", "layout", "coloured paper", "additional needs", "data", "seating plan"] },
    { id: "autonomy", label: "Autonomy and visibility", keywords: ["EHCP", "SEND", "behaviour circles", "informative", "visible", "autonomy"] },
    { id: "seating-my-classroom", label: "Seating and My Classroom", keywords: ["seating", "classroom", "my classroom", "plan"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Room changes and timetable")]: [
    { id: "cover-visibility", label: "Cover visibility", keywords: ["cover", "different colour", "timetable", "calendar", "colour"] },
    { id: "room-swaps", label: "Room swaps", keywords: ["room swap", "unavailable", "alert", "room change", "swap"] },
    { id: "crw-timetable", label: "CRW timetable fields", keywords: ["timetabled events", "date", "custom report", "timetable", "CRW"] },
    { id: "localisation", label: "Localisation", keywords: ["Welsh", "days of the week", "local"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Lesson dashboard and cover")]: [
    { id: "context", label: "Context on dashboard", keywords: ["UDF", "reading age", "access arrangements", "contextual", "dashboard", "context"] },
    { id: "medical", label: "Medical visibility", keywords: ["medical", "pin", "lesson", "medical plans", "medical note", "conditions"] },
    { id: "lesson-cover", label: "Lesson and cover", keywords: ["lesson", "cover", "dashboard"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Display and accessibility")]: [
    { id: "bulk-day", label: "Bulk edit view", keywords: ["whole day", "lesson by lesson", "bulk edit", "filter"] },
    { id: "attendance-subject", label: "Attendance by subject", keywords: ["attendance", "subject", "A level", "figure"] },
    { id: "parent-app", label: "Parent app vs portal", keywords: ["parent app", "parent portal", "teacher of the lesson", "parent", "portal"] },
    { id: "display-accessibility", label: "Display and accessibility", keywords: ["display", "statistics", "section"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Exam seating")]: [
    { id: "register", label: "Register at exam", keywords: ["exam", "registered", "lesson attendance", "exam seating"] },
    { id: "other", label: "Other", keywords: [] },
  ],
  [key("Classroom Management", "Interventions and sessions")]: [
    { id: "reports", label: "Intervention attendance reports", keywords: ["intervention", "attendance", "report", "session"] },
    { id: "other", label: "Other", keywords: [] },
  ],
};

/** Get themes for a sub-category; returns empty array if none defined. */
export function getThemesForSubCategory(category: string, subCategory: string): ThemeDefinition[] {
  return PROBLEM_THEMES[key(category, subCategory)] ?? [];
}

/** Assign a feedback row to a theme id within its sub-category (by keyword match). */
export function assignRowToTheme(
  row: { comment?: string; summary?: string },
  themes: ThemeDefinition[]
): string {
  const text = `${(row.comment ?? "").toLowerCase()} ${(row.summary ?? "").toLowerCase()}`;
  for (const theme of themes) {
    if (theme.keywords.length === 0) continue;
    if (theme.keywords.some((kw) => text.includes(kw.toLowerCase()))) return theme.id;
  }
  const other = themes.find((t) => t.id === "other");
  return other?.id ?? themes[0]?.id ?? "other";
}
