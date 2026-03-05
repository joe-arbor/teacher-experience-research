"use client";

import React from "react";
import Link from "next/link";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";
import { Calendar, Users, Target, FileText, Lightbulb, CheckSquare } from "lucide-react";

const BEHAVIOUR_LOGGING_HMWS = [
  "How might we simplify behaviour logging flows for classroom staff so that they can record incidents accurately in the moment without losing control of the lesson?",
  "How might we simplify logging and reviewing behaviour incidents for teachers and pastoral staff so that they can record what happened without losing teaching time?",
  "How might we make behaviour narratives feel lightweight for teachers so that they can capture meaningful context without it becoming a blocker to logging incidents?",
  "How might we make it obvious who gets notified when behaviour is logged so that the right staff (e.g. class teacher, HOY) see alerts without overload or missed notifications?",
  "How might we make tagging staff in behaviour events intuitive so that the right people are looped in without noisy, irrelevant alerts?",
  "How might we give students timely, clear notifications when behaviour points are recorded so that they and their families can see what was logged and why?",
  "How might we make behaviour and achievement information visible to students in the right place so that they can understand their own record and take ownership of their behaviour?",
  "How might we provide a clear behaviour changelog for school leaders so that they can see who edited an incident and why, building trust in the data?",
];

const BEHAVIOUR_PROBLEM_THEMES_LOGGING = [
  { sub: "Behaviour incidents and logging", themes: ["Incidents and logging workflow", "Mandatory narrative", "Changelogs and audit", "Student visibility"] },
  { sub: "Alerts and notifications", themes: ["Tagging staff", "Student notifications"] },
];

export default function DesignSprintView() {
  const themeReady = useThemeReady();

  if (!themeReady) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>Behaviour design sprint</Heading>
        <p style={{ color: "#57606a", marginBottom: 24, fontSize: 14 }}>
          Five-day sprint focused on the behaviour area. Working prototype by Wednesday afternoon; testing with internal ex-teachers from Thursday.
        </p>
      </HeadingLevel>

      {/* Sprint goal & questions */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Target size={20} />
          Sprint goal and questions
        </h2>
        <div style={{ background: "#f6f8fa", border: "1px solid #d0d7de", borderRadius: 8, padding: 16 }}>
          <p style={{ fontWeight: 600, color: "#24292f", marginBottom: 8 }}>
            Goal
          </p>
          <p style={{ margin: 0, color: "#24292f", lineHeight: 1.5 }}>
            Design and prototype a streamlined <strong>behaviour-logging journey</strong> that we can test with internal ex-teachers on Thursday, so we learn who is impacted at each step and whether the flow works for the teacher first, then for pastoral staff, students, and parents.
          </p>
          <p style={{ fontWeight: 600, color: "#24292f", marginTop: 16, marginBottom: 8 }}>
            Sprint questions
          </p>
          <ol style={{ margin: 0, paddingLeft: 20, color: "#24292f", lineHeight: 1.6 }}>
            <li>Who is impacted when a teacher logs a behaviour incident, and at what points in the journey?</li>
            <li>What is the minimum, clear path from “something happened” to “logged and the right people informed”?</li>
            <li>Does our prototype feel fast and clear enough for a teacher logging in the moment?</li>
          </ol>
        </div>
      </section>

      {/* Format */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={20} />
          Format
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#24292f", lineHeight: 1.6 }}>
          <li><strong>Length:</strong> 5 days (Mon–Fri). Prototype ready by Wednesday afternoon; testing starts Thursday.</li>
          <li><strong>Who attends:</strong> Core team (product, design, eng), decider, 1–2 behaviour/pastoral experts. On Thu–Fri, internal ex-teachers for test sessions.</li>
          <li><strong>Pre-work:</strong> Everyone reads behaviour problem statements and the behaviour HMWs below; behaviour experts bring 2–3 real “I had to log an incident” scenarios.</li>
        </ul>
      </section>

      {/* Agenda */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={20} />
          Agenda (day-by-day)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              day: "Monday – Understand",
              purpose: "Align on the problem and who is impacted.",
              activities: [
                "Review behaviour product feedback and NPS feedback (themes: incidents/logging, narrative, visibility, notifications).",
                "Map the current journey: teacher logs behaviour → who gets notified → what pastoral/HOY/student/parent see and do.",
                "Review behaviour HMWs and problem statements (links below); agree which ones this sprint will address.",
                "Agree sprint goal and sprint questions; document assumptions.",
              ],
              output: "Shared journey map (who is impacted when). Sprint brief (goal + questions).",
            },
            {
              day: "Tuesday – Diverge, Converge, Storyboard",
              purpose: "Generate options, decide direction, plan the prototype.",
              activities: [
                "Diverge: e.g. Crazy 8s on “teacher logs a behaviour incident in under 60 seconds” or “one screen that makes who gets notified obvious”.",
                "Gallery walk; dot-vote or decider pick one direction.",
                "Storyboard the flow to test: 5–8 panels from trigger (e.g. incident in class) to logged + right people informed.",
                "Agree scope of prototype (one path only; what we’re not building).",
              ],
              output: "Chosen concept. Storyboard (panels). Clear scope for Wednesday build.",
            },
            {
              day: "Wednesday – Prototype",
              purpose: "Build a testable prototype. Done by afternoon.",
              activities: [
                "Build clickable prototype (e.g. Figma) of the teacher logging flow and (if in scope) what the notified roles see.",
                "Keep to one path; fake data is fine. Focus on clarity and speed of the logging step.",
                "By end of day: prototype link ready; any prep for Thursday test (script, device, room) confirmed.",
              ],
              output: "Working prototype (link). Test plan and script for Thursday.",
            },
            {
              day: "Thursday – Test",
              purpose: "First tests with internal ex-teachers.",
              activities: [
                "Run 3–5 test sessions with internal ex-teachers. Use interview script: set scenario, ask them to log a behaviour (or react as pastoral/parent if testing that view).",
                "Capture what worked, what didn’t, where they hesitated or misunderstood.",
                "Note pass/fail on key tasks (e.g. “Logged incident in under 2 minutes”, “Could say who gets notified”).",
              ],
              output: "Test notes and raw feedback. First pass/fail signals.",
            },
            {
              day: "Friday – Test and learn",
              purpose: "More tests if needed; synthesise and recommend.",
              activities: [
                "Run more test sessions if needed to reach 5+ total.",
                "Synthesise findings: what we learned vs. sprint questions; what to fix in the prototype; what to take into the backlog.",
                "Sprint report: what we did, what we learned, what we recommend (prototype iteration, build, or further discovery).",
              ],
              output: "Sprint report. Prioritised recommendations. Updated prototype or backlog items.",
            },
          ].map((block) => (
            <div
              key={block.day}
              style={{
                border: "1px solid #d0d7de",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div style={{ padding: "12px 16px", background: "#f6f8fa", borderBottom: "1px solid #d0d7de", fontWeight: 600, color: "#24292f" }}>
                {block.day}
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: 13, color: "#57606a" }}>{block.purpose}</p>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
                  {block.activities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                <p style={{ margin: "12px 0 0 0", fontSize: 13, color: "#0969da", fontWeight: 500 }}>
                  Output: {block.output}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key activities */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Lightbulb size={20} />
          Key activities (facilitation notes)
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#24292f", lineHeight: 1.6 }}>
          <li><strong>Journey map (Mon):</strong> On a board or Miro, draw the flow from “incident happens” to “logged and communicated”. For each step, add: who acts, who is notified, what they see. Use sticky notes for pain points from product/NPS feedback.</li>
          <li><strong>Crazy 8s (Tue):</strong> Each person sketches 8 ideas in 8 minutes (e.g. “one screen to log”, “who gets notified”). Gallery walk; no critique yet. Then dot-vote or decider picks one direction.</li>
          <li><strong>Storyboard (Tue):</strong> 5–8 panels; stick figures are fine. Agree the one path we’re prototyping (e.g. teacher on register → log incident → choose type → add short note → confirm; then show “HOY and class teacher notified”).</li>
          <li><strong>Test script (Thu):</strong> “You’re in class and need to log a behaviour incident. Use this prototype to do it.” Observe where they pause, misclick, or ask questions. Then: “Who do you expect to see this?” and “What would you want the student/parent to see?”</li>
        </ul>
      </section>

      {/* Behaviour HMWs and problem themes */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={20} />
          Behaviour focus: logging journey
        </h2>
        <p style={{ marginBottom: 12, color: "#24292f", fontSize: 14 }}>
          HMWs and problem themes that directly support this sprint (logging a behaviour and everyone impacted). Use the full lists on the app for deeper context.
        </p>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>HMWs to keep in front of the team</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.6, color: "#24292f" }}>
            {BEHAVIOUR_LOGGING_HMWS.map((hmw, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{hmw}</li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Problem themes (behaviour) – logging and notifications</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
            {BEHAVIOUR_PROBLEM_THEMES_LOGGING.map((row, i) => (
              <li key={i}><strong>{row.sub}</strong>: {row.themes.join(", ")}</li>
            ))}
          </ul>
        </div>
        <p style={{ marginTop: 12, fontSize: 13 }}>
          <Link href="/problems" style={{ color: "#0969da", marginRight: 12 }}>Product problems (filter to Behaviour)</Link>
          <Link href="/nps-hmw" style={{ color: "#0969da", marginRight: 12 }}>NPS HMW</Link>
          <Link href="/design-hmw" style={{ color: "#0969da", marginRight: 12 }}>Design HMW</Link>
          <Link href="/nps" style={{ color: "#0969da" }}>NPS Feedback</Link>
        </p>
      </section>

      {/* Artifacts and success */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckSquare size={20} />
          Artifacts and success criteria
        </h2>
        <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Artifacts</p>
        <ul style={{ margin: "0 0 16px 20px", fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
          <li>Sprint brief (goal + questions)</li>
          <li>Journey map: who is impacted when a behaviour is logged</li>
          <li>Storyboard (5–8 panels)</li>
          <li>Clickable prototype (link) – ready by Wed PM</li>
          <li>Test script and notes</li>
          <li>Sprint report (what we did, learned, recommend)</li>
        </ul>
        <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Success criteria</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
          <li>Decider has chosen one flow to prototype and test.</li>
          <li>Working prototype is ready by Wednesday afternoon.</li>
          <li>At least 5 test sessions completed (Thu–Fri) with feedback captured.</li>
          <li>Sprint report documents what we learned and what we recommend next.</li>
        </ul>
      </section>

      {/* Assumptions and options */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#24292f", marginBottom: 12 }}>
          Assumptions and options
        </h2>
        <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Assumptions</p>
        <ul style={{ margin: "0 0 16px 20px", fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
          <li>Internal ex-teachers are available for testing on Thursday (and optionally Friday).</li>
          <li>We scope the prototype to one primary path (e.g. teacher logs one incident; optionally show what HOY/student sees) so we don’t over-build.</li>
          <li>Figma (or similar) is sufficient for a clickable prototype; no dev build required for this test.</li>
        </ul>
        <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>If constraints change</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.5, color: "#24292f" }}>
          <li>If we can’t get 5 test users: run 3 internal “demo and critique” sessions and label findings as hypotheses to validate with real users later.</li>
          <li>If prototype isn’t ready Wed PM: move first test to Friday and use Thursday for final build and script run-through.</li>
        </ul>
      </section>
    </div>
  );
}
