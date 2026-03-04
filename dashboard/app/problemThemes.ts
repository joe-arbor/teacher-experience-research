/**
 * Theme definitions per sub-category for Product problems.
 * Assignment: first theme whose keyword matches (comment + summary, case-insensitive) wins; no match → Other.
 * Formula: use broad keywords (single meaningful words + phrases); put specific phrases before generic words.
 */
export interface ThemeDefinition {
  id: string;
  label: string;
  /** Short one-sentence summary of what this theme captures. */
  description?: string;
  keywords: string[];
}

export type ProblemThemesMap = Record<string, ThemeDefinition[]>;

function key(category: string, subCategory: string): string {
  return `${category}|${subCategory}`;
}

export const PROBLEM_THEMES: ProblemThemesMap = {
  [key("Attendance & Registers", "Bulk edit and workflow")]: [
    { id: "friction", label: "Friction in bulk steps", description: "Feedback about too many steps, filters, or clunky workflows when editing attendance in bulk.", keywords: ["bulk edit", "bulk update", "too many steps", "filters", "date and group", "add attendance notes", "marks", "steps", "filters for date"] },
    { id: "peripatetic", label: "Peripatetic / external staff", description: "Issues with peripatetic or external staff, paper registers, or outside providers.", keywords: ["peripatetic", "paper registers", "external", "outside companies", "peripatetic teachers"] },
    { id: "latecomer", label: "Latecomer and monitoring", description: "Late marks, latecomers, N/O codes, and monitoring attendance.", keywords: ["latecomer", "house teams", "N codes", "O codes", "absentees", "late", "monitoring attendance"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Pre-planned absence and notes")]: [
    { id: "notes-flow", label: "Notes not flowing to register", description: "Notes or reasons not showing or pulling through to the register correctly.", keywords: ["pulled through", "onto the register", "reason", "wedding", "ill", "notes", "register", "authorised", "show"] },
    { id: "overridden", label: "Planned marks overridden", description: "Pre-set or planned marks being overridden when the register is taken.", keywords: ["overridden", "prior to the register", "set the mark", "teacher", "taking the register", "pre-set"] },
    { id: "fines", label: "Fines / unauthorised rules", description: "Fines, unauthorised absence rules, or term-length thresholds.", keywords: ["fines", "unauthorised", "five days", "ten week", "3 days"] },
    { id: "ad-hoc", label: "Ad hoc interventions as absence", description: "Recording ad hoc or in-school interventions as absence.", keywords: ["ad hoc", "intervention", "planned absence", "in school", "ad hoc intervention"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Codes and marks")]: [
    { id: "locking", label: "Locking / permissions", description: "Who can change marks, lock registers, or permission issues.", keywords: ["locking", "only attendance officer", "teachers can change", "lock", "permission", "change marks"] },
    { id: "custom-census", label: "Custom codes and census", description: "Custom attendance codes, census mapping, or DofE codes.", keywords: ["custom", "DofE", "census", "map", "code", "attendance code"] },
    { id: "suspended", label: "Suspended registers", description: "Suspended or incomplete registers and related workflow.", keywords: ["suspended", "incomplete registers", "suspension"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Clubs and wrap-around")]: [
    { id: "capacity", label: "Capacity and booking", description: "Capacity limits, booking pupils, or parent booking.", keywords: ["full", "maximum", "book", "parents", "capacity", "booking", "pupil numbers"] },
    { id: "cancel", label: "Cancelling sessions", description: "Cancelling club sessions (e.g. weather, staff illness).", keywords: ["cancel", "cancelled", "weather", "staff illness", "session", "cancel a club"] },
    { id: "reporting", label: "Reporting and intervals", description: "Club reporting, session intervals, or deleting sessions.", keywords: ["report", "session intervals", "end", "deleting", "intervals", "club"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Evacuation and emergency registers")]: [
    { id: "access", label: "Access and placement", description: "Quick access to evacuation registers, placement on homescreen, or finding them.", keywords: ["homescreen", "path", "quick access", "Emergency Evacuation", "access", "evacuation"] },
    { id: "format", label: "Format and filtering", description: "Export format (xlsx/csv), filtering evacuation lists, or tutor group.", keywords: ["xlsx", "csv", "filter", "tutor group", "download", "format"] },
    { id: "display", label: "Display", description: "Print, visibility, or display of evacuation registers (e.g. bold, visually impaired).", keywords: ["bolder", "print", "visually impaired", "absent pupils", "print out"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Reporting and statistics")]: [
    { id: "meal", label: "Meal registers", description: "Meal registers, kitchen numbers, dinner or lunch counts.", keywords: ["meal", "weeks meal", "kitchen", "dinner", "lunch", "menu"] },
    { id: "persistent", label: "Persistent absence", description: "Persistent absence reporting or tracking absentees.", keywords: ["persistent absence", "absentees", "persistent"] },
    { id: "percentage", label: "Attendance % on pages", description: "Where attendance percentage or absentees by date are shown.", keywords: ["attendance percentage", "absentees by date", "percentage", "attendance %"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Staff absence and cover")]: [
    { id: "udf", label: "UDFs on registers/dashboard", description: "UDFs (e.g. reading age) on class register or dashboard.", keywords: ["UDF", "reading age", "class register", "dashboard", "class dashboard"] },
    { id: "pastoral", label: "Pastoral notes visibility", description: "Pastoral notes not visible or hard to find where needed.", keywords: ["pastoral notes", "visible", "pastoral"] },
    { id: "cover-split", label: "Cover splitting", description: "Splitting cover, double lessons, or manually amending cover.", keywords: ["splitting", "double lesson", "manually amend", "cover", "split"] },
    { id: "annual-leave", label: "Annual leave and holidays", description: "Annual leave, 52-week contracts, school holidays, or support staff leave.", keywords: ["annual leave", "52 weeks", "school holiday", "leave", "support staff"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Roll call and daily settings")]: [
    { id: "lunch-kitchen", label: "Lunch numbers and kitchen", description: "Lunch numbers, kitchen counts, or meal-related daily settings.", keywords: ["kitchen", "lunch numbers", "lunch"] },
    { id: "notes-pupils", label: "Notes for individual pupils", description: "Notes for individual pupils or pastoral notes visibility for pupils.", keywords: ["notes", "individual pupils", "Pastoral Notes", "pupils", "notes for"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Attendance & Registers", "Notifications and acknowledgements")]: [
    { id: "sibling", label: "Sibling / household absence", description: "Sibling or same-household absence, same date or reason.", keywords: ["sibling", "same household", "same date", "same reason", "siblings"] },
    { id: "alerts", label: "Absence notifications", description: "Notifications or alerts when pupils are absent.", keywords: ["notifications", "notify", "absence", "alert"] },
    { id: "notes-wipe", label: "Notes vs register", description: "Notes wiping, notifying the teacher, or marks vs notes.", keywords: ["wipe", "notify the teacher", "notes", "register", "mark notes"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Behaviour incidents and logging")]: [
    { id: "changelog", label: "Changelogs and audit", description: "Changelogs, who changed what, or audit of behaviour data.", keywords: ["changelog", "changed", "permission", "changelogs", "data including"] },
    { id: "student-visibility", label: "Student visibility", description: "Students not being able to see achievement points, incident reasons, or lists of behaviour.", keywords: ["students can't see", "achievement points", "reasons", "behaviour incidents", "student", "see", "list of"] },
    { id: "mandatory", label: "Mandatory narrative", description: "Narrative being mandatory or workflow around making narrative.", keywords: ["mandatory", "narrative", "make narrative"] },
    { id: "incidents-logging", label: "Incidents and logging workflow", description: "Logging incidents, behaviour workflow, or general behaviour logging.", keywords: ["incident", "log", "logging", "behaviour", "arbor behaviour"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Detentions")]: [
    { id: "session-blocking", label: "Session blocking", description: "Assigning pupils to sessions, deselecting, or session already assigned issues.", keywords: ["single pupil", "already assigned", "none of the pupils", "flag", "deselect", "assign", "session", "group of pupils"] },
    { id: "session-visibility", label: "Session visibility", description: "How far ahead detentions show (e.g. 20 vs 100 days), or upcoming detention view.", keywords: ["100 days", "20 days", "upcoming detention", "days", "showing"] },
    { id: "student-copy", label: "Student/parent copy", description: "Student or parent getting a copy of the email, narrative, or reason.", keywords: ["student should", "copy of the email", "narrative", "reason behind", "email", "parent", "guardian"] },
    { id: "detention-workflow", label: "Detention workflow", description: "Setting detentions, sessions, or general detention workflow.", keywords: ["detention", "set", "session"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Points and rewards")]: [
    { id: "student-view", label: "Student view / data on display", description: "Student view of points, display on the board, or data rules for display.", keywords: ["student view", "points", "display on the board", "data rules", "board", "view"] },
    { id: "bulk-upload", label: "Bulk upload", description: "Bulk uploading points or rewards for a whole group vs individually.", keywords: ["upload", "whole group", "individually", "bulk", "group of students"] },
    { id: "narrative", label: "Narrative mandatory", description: "Narrative or reason mandatory, or shared with pupil.", keywords: ["narrative", "reason", "shared with pupil", "mandatory"] },
    { id: "achievement", label: "Achievement points", description: "Achievement points, rewards, or positive behaviour points.", keywords: ["achievement", "point", "reward", "positive"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Report cards and pastoral")]: [
    { id: "progress-timeline", label: "Progress timeline on report cards", description: "Progress timeline on report cards or tracking report for parents.", keywords: ["progress timeline", "report card", "parents", "progress", "tracking report"] },
    { id: "notes-comm", label: "Notes in communications view", description: "Notes in communications, letters, emails, or meetings view.", keywords: ["notes", "communications", "letters", "emails", "meetings", "communication"] },
    { id: "on-report", label: "On-report / structured monitoring", description: "On-report, report cards, or tracking and intervening.", keywords: ["on-report", "report card", "track", "intervene", "monitoring", "on report"] },
    { id: "layout", label: "Report layout", description: "Landscape, portrait, one page, or orientation of reports.", keywords: ["landscape", "portrait", "one page", "orientation", "standard report"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Alerts and notifications")]: [
    { id: "tagging", label: "Tagging staff", description: "Tagging staff to be notified, class teacher, or who gets alerts.", keywords: ["tag", "notified", "class teacher", "tagging", "members of staff"] },
    { id: "student-notif", label: "Student notifications", description: "Students receiving notifications when points are given.", keywords: ["student", "notification", "point", "given"] },
    { id: "cover-email", label: "Cover email default", description: "Cover and default email or tick options for email notifications.", keywords: ["cover", "default", "tick", "email notifications"] },
    { id: "suspension", label: "Suspension notification", description: "Suspension notifications, attachments, or notifying guardians.", keywords: ["suspension", "attachment", "Notify Guardians", "guardian"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Custom reports")]: [
    { id: "filter-share", label: "Behaviour filters and share", description: "Filtering behaviour reports, custom groups, or sharing custom reports.", keywords: ["filter", "custom groups", "share", "custom report"] },
    { id: "suspension-stats", label: "Suspension stats", description: "Suspension or exclusion statistics and how they're presented.", keywords: ["suspensions", "week by week", "misleading", "exclusion", "statistics"] },
    { id: "demographics", label: "Demographics", description: "SEN, PP, or other demographic info in behaviour reports.", keywords: ["SEN", "PP", "demographic", "demographic info"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Permissions and visibility")]: [
    { id: "reg-date", label: "Reg group and date", description: "Pupils no longer in reg group, left school, academic year, or transferred.", keywords: ["no longer in the reg group", "left school", "academic year", "reg group", "transferred"] },
    { id: "split-pos-neg", label: "Split positive/negative", description: "Splitting positive and negative points, permission, or allocation.", keywords: ["positive", "negative", "permission", "allocation", "allocate"] },
    { id: "teacher-name", label: "Teacher name on timetable", description: "Teacher name shown on timetable or what students see.", keywords: ["teacher", "timetable", "students see", "displayed teacher"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Behaviour Management", "Physical intervention and safeguarding")]: [
    { id: "record-pi", label: "Record all PI", description: "Recording physical intervention, restrictive practice, or legislation.", keywords: ["physical intervention", "Restrictive", "legislation", "record", "PI"] },
    { id: "limit-access", label: "Limit access", description: "Safeguarding, limiting access to behaviour log, or categories.", keywords: ["safeguarding", "limit access", "behaviour log", "categories"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Seating plans and My Classroom")]: [
    { id: "redundant", label: "Removing/redundant layouts", description: "Removing, deleting, or redundant seating layouts.", keywords: ["redundant", "remove", "delete", "accidentally", "extra", "layout"] },
    { id: "customisation", label: "Customisation", description: "Custom notes, font size, or display options on seating plans.", keywords: ["custom notes", "font", "bigger", "exam candidate", "size", "option"] },
    { id: "data-on-layout", label: "Data on layout", description: "UDFs, data, or additional needs on seating plan layout.", keywords: ["UDF", "layout", "coloured paper", "additional needs", "data", "seating plan"] },
    { id: "autonomy", label: "Autonomy and visibility", description: "EHCP, SEND, behaviour circles, or what's visible and configurable.", keywords: ["EHCP", "SEND", "behaviour circles", "informative", "visible", "autonomy"] },
    { id: "seating-my-classroom", label: "Seating and My Classroom", description: "Seating plans, My Classroom, or general classroom layout.", keywords: ["seating", "classroom", "my classroom", "plan"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Room changes and timetable")]: [
    { id: "cover-visibility", label: "Cover visibility", description: "Cover shown in a different colour on timetable or calendar.", keywords: ["cover", "different colour", "timetable", "calendar", "colour"] },
    { id: "room-swaps", label: "Room swaps", description: "Room swaps, unavailable rooms, or room change alerts.", keywords: ["room swap", "unavailable", "alert", "room change", "swap"] },
    { id: "crw-timetable", label: "CRW timetable fields", description: "Timetabled events, date, or CRW custom report timetable.", keywords: ["timetabled events", "date", "custom report", "timetable", "CRW"] },
    { id: "localisation", label: "Localisation", description: "Welsh, days of the week, or other localisation.", keywords: ["Welsh", "days of the week", "local"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Lesson dashboard and cover")]: [
    { id: "context", label: "Context on dashboard", description: "UDF, reading age, access arrangements, or context on lesson dashboard.", keywords: ["UDF", "reading age", "access arrangements", "contextual", "dashboard", "context"] },
    { id: "medical", label: "Medical visibility", description: "Medical plans, medical notes, or conditions visible on lesson view.", keywords: ["medical", "pin", "lesson", "medical plans", "medical note", "conditions"] },
    { id: "lesson-cover", label: "Lesson and cover", description: "Lesson dashboard and cover workflow.", keywords: ["lesson", "cover", "dashboard"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Display and accessibility")]: [
    { id: "bulk-day", label: "Bulk edit view", description: "Bulk edit for whole day vs lesson by lesson, or filtering.", keywords: ["whole day", "lesson by lesson", "bulk edit", "filter"] },
    { id: "attendance-subject", label: "Attendance by subject", description: "Attendance by subject or A level figures.", keywords: ["attendance", "subject", "A level", "figure"] },
    { id: "parent-app", label: "Parent app vs portal", description: "Parent app, parent portal, or teacher of the lesson visibility.", keywords: ["parent app", "parent portal", "teacher of the lesson", "parent", "portal"] },
    { id: "display-accessibility", label: "Display and accessibility", description: "Display, statistics, or accessibility of the section.", keywords: ["display", "statistics", "section"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Exam seating")]: [
    { id: "register", label: "Register at exam", description: "Register at exam, lesson attendance, or exam seating.", keywords: ["exam", "registered", "lesson attendance", "exam seating"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
  ],
  [key("Classroom Management", "Interventions and sessions")]: [
    { id: "reports", label: "Intervention attendance reports", description: "Intervention attendance or session reports.", keywords: ["intervention", "attendance", "report", "session"] },
    { id: "other", label: "Other", description: "Feedback that didn't match a more specific theme.", keywords: [] },
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
