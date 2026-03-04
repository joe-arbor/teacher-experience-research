"use client";

import React from "react";
import { useThemeReady } from "@/app/providers";
import { Heading, HeadingLevel } from "baseui/heading";

const sectionStyle: React.CSSProperties = {
  marginBottom: 32,
  padding: "20px 24px",
  background: "#ffffff",
  borderRadius: 8,
  border: "1px solid #d0d7de",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: "#24292f",
  marginBottom: 12,
  marginTop: 0,
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#24292f",
  margin: 0,
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px 24px",
  marginBottom: 12,
};

const statStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#57606a",
};

const statHighlightStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#24292f",
};

const listStyle: React.CSSProperties = {
  margin: "8px 0 0 0",
  paddingLeft: 20,
};

const cardsRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  marginBottom: 16,
};

function DataCard({
  value,
  label,
  sublabel,
  variant = "neutral",
}: {
  value: string | number;
  label: string;
  sublabel?: string;
  variant?: "negative" | "positive" | "neutral" | "warning";
}) {
  const variantStyles: Record<string, { bg: string; valueColor: string }> = {
    negative: { bg: "#ffebe9", valueColor: "#cf222e" },
    positive: { bg: "#dafbe1", valueColor: "#1a7f37" },
    neutral: { bg: "#f6f8fa", valueColor: "#24292f" },
    warning: { bg: "#fff8c5", valueColor: "#9a6700" },
  };
  const s = variantStyles[variant] ?? variantStyles.neutral;
  return (
    <div
      style={{
        padding: "16px 20px",
        background: s.bg,
        borderRadius: 8,
        border: "1px solid #d0d7de",
        minWidth: 120,
        flex: "1 1 140px",
        maxWidth: 220,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, color: s.valueColor }}>{value}</div>
      <div style={{ fontSize: 12, color: "#57606a", marginTop: 4 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: "#848d97", marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}

export default function NpsHeadlinesView() {
  const themeReady = useThemeReady();

  if (!themeReady) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: 0, padding: "24px 16px", boxSizing: "border-box" }}>
      <HeadingLevel>
        <Heading style={{ marginBottom: 8 }}>NPS Headlines</Heading>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Key findings from Teacher NPS 2025. Summary for leadership and product.
        </p>
      </HeadingLevel>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>1. The headline is ugly: teachers are net negative on recommending you</h2>
        <div style={cardsRowStyle}>
          <DataCard value="-38.1" label="Overall NPS" variant="negative" />
          <DataCard value="58.0%" label="Detractors (0–6)" variant="negative" />
          <DataCard value="22.1%" label="Passives (7–8)" variant="neutral" />
          <DataCard value="19.9%" label="Promoters (9–10)" variant="positive" />
          <DataCard value="5.12" label="Mean recommend score" sublabel="median 5" variant="neutral" />
          <DataCard value="28.5%" label="Gave 0–2 (actively warning others off)" variant="negative" />
        </div>
        <p style={bodyStyle}>
          This is not “mixed feedback”. This is a clear majority saying they would not recommend.
        </p>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          A really telling detail: <strong>28.5% of all respondents gave a 0 to 2</strong>. That is not mild dissatisfaction, that is people actively warning others off.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>2. The product is failing its core promise: saving time</h2>
        <p style={bodyStyle}>
          On the value statements (0 to 5 scale), the results are consistently low:
        </p>
        <div style={cardsRowStyle}>
          <DataCard value="2.21" label="“Arbor has improved the way I work”" sublabel="44.9% at 0–1 (low agreement)" variant="warning" />
          <DataCard value="2.20" label="“Arbor makes analysing data easier”" sublabel="43.9% at 0–1" variant="warning" />
          <DataCard value="2.45" label="“Arbor saves me time”" sublabel="37.8% at 0–1" variant="warning" />
        </div>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          So the dominant perception is: it is not improving work and it is not saving time. That is your NPS in a nutshell.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>3. The strongest driver of NPS is time saving, by a mile</h2>
        <p style={bodyStyle}>Correlation with “recommend” score:</p>
        <div style={cardsRowStyle}>
          <DataCard value="0.81" label="Saves me time" sublabel="very strong" variant="neutral" />
          <DataCard value="0.73" label="Improved the way I work" variant="neutral" />
          <DataCard value="0.57" label="Makes analysing data easier" variant="neutral" />
        </div>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          And the step change is brutal. If someone agrees Arbor saves them time, NPS flips positive:
        </p>
        <div style={cardsRowStyle}>
          <DataCard value="-83 to -97" label="“Saves time” = 0–2" variant="negative" />
          <DataCard value="+20 to +26" label="“Saves time” = 4" variant="positive" />
          <DataCard value="+70 to +87" label="“Saves time” = 5" variant="positive" />
        </div>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          So stop guessing. If you want NPS to move, you have to make teachers feel it saves time in their day-to-day workflows. Nothing else is going to outvote that.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>4. Newer go-lives are dramatically worse, which screams onboarding and early experience failure</h2>
        <p style={bodyStyle}>By Go Live year (with reasonable sample sizes):</p>
        <div style={cardsRowStyle}>
          <DataCard value="+2.9" label="2021" sublabel="n=35" variant="positive" />
          <DataCard value="-17.3" label="2022" sublabel="n=133" variant="negative" />
          <DataCard value="-26.2" label="2023" sublabel="n=103" variant="negative" />
          <DataCard value="-31.9" label="2024" sublabel="n=204" variant="negative" />
          <DataCard value="-54.9" label="2025" sublabel="n=486" variant="negative" />
        </div>
        <p style={bodyStyle}>
          Two things this implies: Your first-year experience is broken. 2025 go-lives are in the basement. Even older cohorts are still negative, just less catastrophically so. This is not only an onboarding issue, but onboarding is clearly making it much worse.
        </p>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          If you try to spin this as “2025 is just a tough year”, you’ll get caught. The pattern is too consistent: the newer the go-live, the worse the perception of time saving and the worse NPS.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>5. Admin and leadership roles are more negative than teachers</h2>
        <p style={bodyStyle}>NPS by role group:</p>
        <div style={cardsRowStyle}>
          <DataCard value="-31.0" label="Teacher" variant="negative" />
          <DataCard value="-47.4" label="SLT Teacher" variant="negative" />
          <DataCard value="-48.1" label="Admin Teacher" variant="negative" />
          <DataCard value="-59.5" label="Admin SLT Teacher" variant="negative" />
        </div>
        <p style={bodyStyle}>
          That’s dangerous because the people closest to operations, reporting, compliance, and decision making are the least likely to recommend you. If renewals, procurement, or internal advocacy matter, this is where you get hurt.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>6. The comments are consistent: it’s workflow friction, not “missing features”</h2>
        <p style={bodyStyle}>
          Theme scan of comments (simple keyword mapping; treat as directional). Among detractors, the most common complaint clusters are:
        </p>
        <ul style={listStyle}>
          <li style={statStyle}>Registers and attendance</li>
          <li style={statStyle}>Too many clicks / too many steps / clunky workflows</li>
          <li style={statStyle}>Behaviour, detentions, rewards points logging</li>
          <li style={statStyle}>Reporting and data extraction</li>
          <li style={statStyle}>Navigation and findability (hard to find things, not intuitive)</li>
          <li style={statStyle}>Plus meaningful mentions of parents communication, timetable/cover, mobile/app usability</li>
        </ul>
        <p style={{ ...bodyStyle, marginTop: 12 }}>Differentiators between detractors and promoters:</p>
        <div style={cardsRowStyle}>
          <DataCard value="15.6% vs ~0%" label="“Too many clicks / clunky workflow”" sublabel="detractors vs promoters" variant="negative" />
          <DataCard value="10.4% vs 0.5%" label="“Navigation / findability”" sublabel="detractors vs promoters" variant="negative" />
          <DataCard value="14.7% vs 3.9%" label="“Behaviour”" sublabel="detractors vs promoters" variant="negative" />
        </div>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          So the story is not “teachers want more stuff”. It’s “core tasks take too long, are hard to find, and feel painful.” Competitors get named (SIMS, ClassCharts, ScholarPack). That usually happens when people feel the comparison is unfavourable and they want to justify their frustration.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>7. Schools with multiple respondents are far more negative</h2>
        <p style={bodyStyle}>
          Most schools have one response, but where multiple staff responded, NPS is much worse:
        </p>
        <div style={cardsRowStyle}>
          <DataCard value="-28.4" label="Single-response schools" variant="negative" />
          <DataCard value="-55.8" label="Multi-response schools" variant="negative" />
        </div>
        <p style={bodyStyle}>Even within 2025 go-lives:</p>
        <div style={cardsRowStyle}>
          <DataCard value="-45.2" label="2025 single-response" variant="negative" />
          <DataCard value="-65.4" label="2025 multi-response" variant="negative" />
        </div>
        <p style={bodyStyle}>
          Interpretation: the more widely the product is being used inside a school, the more pain is being felt, or the more motivated unhappy staff are to respond. Either way, it’s a red flag because broad adoption is not translating into advocacy.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>8. Your internal “Current Score Score” tracks NPS, so you can triage</h2>
        <p style={bodyStyle}>If you bucket “Current Score Score” into quartiles:</p>
        <div style={cardsRowStyle}>
          <DataCard value="-58.0" label="Lowest quartile" variant="negative" />
          <DataCard value="-2.8" label="Highest quartile" variant="neutral" />
        </div>
        <p style={bodyStyle}>
          So whatever that score represents, it is directionally aligned with sentiment. It can be used to prioritise interventions, but it is not saving you. Even the “best” quartile is still slightly negative.
        </p>
      </section>
    </div>
  );
}
