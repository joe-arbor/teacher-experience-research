# NPS feedback enrichment: category, sub-category, and theme

## What was done

The file **Teacher NPS feedback 2025.csv** was enriched with three new fields using the same logic as the Jira feedback / Product problems in the dashboard:

1. **top_level_category** – One of: `Attendance & Registers`, `Behaviour Management`, `Classroom Management`, or `Uncategorised`.
2. **sub_category** – e.g. `Seating plans and My Classroom`, `Behaviour incidents and logging`, or `Uncategorised`.
3. **theme_id** – e.g. `seating-my-classroom`, `detention-workflow`, or `other`.

## Output files

- **Teacher NPS feedback 2025_enriched.json** – Full JSON array of enriched rows (all original columns plus the three new fields).
- **Teacher NPS feedback 2025_enriched.csv** – Same data as CSV with the three new columns appended.

## Formula (same as Jira / Product problems)

1. **Input text**  
   For each NPS row, the text used for matching is the **Comments** column only (no summary field in NPS).

2. **Theme definitions**  
   The dashboard’s **problemThemes** (in `dashboard/app/problemThemes.ts`) define, for each **(category, sub_category)** pair, a list of **themes**. Each theme has an `id`, a `label`, and a list of **keywords**.

3. **Assignment steps**  
   - For each row, we consider every **(category, sub_category)** pair in problemThemes (e.g. "Attendance & Registers" + "Roll call and daily settings", "Behaviour Management" + "Detentions", etc.).
   - For each pair we get its list of themes and run **keyword matching** on the comment text (case-insensitive):
     - The **first theme** (in order) whose **any keyword** appears in the text is chosen.
     - Themes with empty keywords (the “Other” theme) are skipped for this match.
   - As soon as one pair returns a **non-“other”** theme, we assign:
     - **top_level_category** = that category  
     - **sub_category** = that sub_category  
     - **theme_id** = that theme’s id  
     and stop.
   - If we try all pairs and every one returns the “other” theme (no keyword match), we set:
     - **top_level_category** = `Uncategorised`  
     - **sub_category** = `Uncategorised`  
     - **theme_id** = `other`

4. **Order of pairs**  
   The order in which (category, sub_category) pairs are tried is the object key order in `PROBLEM_THEMES`. The **first** pair that produces a non-“other” theme wins. So if the comment matches keywords in more than one sub-category, the one that appears first in the themes map is used.

## Summary of changes to the data

- **Original CSV** – Unchanged; still in `Teacher NPS feedback 2025.csv`.
- **New columns** – Every row now has:
  - **top_level_category** – Aligns NPS with the same three product areas (or Uncategorised).
  - **sub_category** – Finer area within that category (or Uncategorised).
  - **theme_id** – Specific theme within that sub-category for reporting/grouping (or `other`).

Rows with no keyword match in any theme (e.g. very short or generic comments like “Straight forward to use”) are marked **Uncategorised / Uncategorised / other**. You can refine the keyword lists in `problemThemes.ts` and re-run the script to improve assignment.

## How to re-run the enrichment

From the **dashboard** folder:

```bash
npx ts-node --compiler-options '{"module":"CommonJS","moduleResolution":"node"}' scripts/enrich-nps.ts
```

Or, if you add the script to `dashboard/package.json`:

```bash
npm run enrich-nps
```

The script reads `User Feedback/Teacher NPS feedback 2025.csv` and overwrites the two enriched files in the same folder.
