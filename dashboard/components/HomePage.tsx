"use client";

import Link from "next/link";

const MODULE_CARDS = [
  { href: "/dashboard", title: "Jira Feedback Dashboard", icon: "📊" },
  { href: "/categories", title: "Category quotes", icon: "💬" },
  { href: "#", title: "Research", icon: "▥" },
  { href: "#", title: "Design Prototypes", icon: "▦" },
  { href: "#", title: "Competitive Analysis", icon: "▧" },
  { href: "#", title: "Intermission", icon: "▨" },
  { href: "#", title: "Activation Strategy", icon: "▩" },
];

const CALLOUTS = [
  {
    heading: "PROBLEM STATEMENT",
    body:
      "We receive consistent feedback that the teacher experience is a blocker to schools fully loving and recommending Arbor. We want to move schools away from using third party software and ensure that core activities take place within the MIS.",
    source: "From research & Jira feedback",
  },
  {
    heading: "VALUE TO USERS/CUSTOMERS",
    body:
      "Improving the UX of core teacher flows will help schools save time completing critical tasks, significantly reduce clicks, and increase everyday usage.",
    source: "From User Experience framing",
  },
  {
    heading: "STRATEGIC BUSINESS VALUE",
    body:
      "1) Easier upsell to higher packages. 2) Greater adoption of features. 3) Higher stickiness across Behaviour, Attendance, and My Classroom.",
    source: "From Product & GTM alignment",
  },
];

export function HomePage() {
  return (
    <div style={{ padding: "32px 24px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#24292f" }}>
          Teacher Experience PDS
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#57606a" }}>
          Central space for the Teacher Experience Product Discovery & Strategy project
        </p>
      </header>

      <section style={{ marginBottom: 32 }}>
        <div className="home-modules-grid">
          {MODULE_CARDS.map((card) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              className="module-card"
              style={{
                display: "block",
                padding: 20,
                background: "#ffffff",
                borderRadius: 12,
                border: "1px solid #d0d7de",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow 0.15s ease, border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#eaeef2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                {card.icon}
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#24292f" }}>
                {card.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            padding: 24,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d0d7de",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#24292f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e6edf3",
                fontSize: 18,
              }}
            >
              ✦
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#24292f" }}>
                Context Synthesis
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#57606a" }}>
                Compiled from PRD, research, and stakeholder notes
              </p>
            </div>
          </div>
          <div className="home-callouts-grid">
            {CALLOUTS.map((block) => (
              <div
                key={block.heading}
                style={{
                  padding: 16,
                  background: "#f6f8fa",
                  borderRadius: 8,
                  border: "1px solid #eaeef2",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: "#57606a", letterSpacing: "0.05em", marginBottom: 8 }}>
                  {block.heading}
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#24292f", lineHeight: 1.5 }}>
                  {block.body}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#57606a" }}>
                  <span>←</span>
                  {block.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
