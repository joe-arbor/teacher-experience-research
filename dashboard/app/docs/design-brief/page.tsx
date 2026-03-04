"use client";

export default function DesignBriefPage() {
  return (
    <div style={{ padding: "32px 24px 48px", maxWidth: 900, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#24292f" }}>
          Design Brief
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#57606a" }}>
          Project file — rendered inside this workspace
        </p>
      </header>

      <main>
        <section
          style={{
            marginBottom: 24,
            padding: 20,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d0d7de",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 600, color: "#24292f" }}>
            Overview
          </h2>
          <p style={{ fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            This is a structured, in-product view of the <strong>Design Brief.pdf</strong>. It is intended to provide a
            readable, consistent layout alongside the rest of the Teacher Experience workspace.
          </p>
        </section>

        <section
          style={{
            marginBottom: 24,
            padding: 20,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d0d7de",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 600, color: "#24292f" }}>
            Goals & constraints
          </h2>
          <p style={{ fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            Use this space to capture the key design goals, non-goals, and constraints for the Teacher Experience
            workstream. Content from the Design Brief PDF can be migrated here to keep everything in one place.
          </p>
        </section>

        <section
          style={{
            marginBottom: 24,
            padding: 20,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d0d7de",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 600, color: "#24292f" }}>
            Key sections
          </h2>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            <li>Problem & opportunity</li>
            <li>Target users and scenarios</li>
            <li>Experience principles</li>
            <li>Scope & deliverables</li>
            <li>Timeline & success measures</li>
          </ul>
        </section>

        <section
          style={{
            padding: 20,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d0d7de",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 600, color: "#24292f" }}>
            Notes
          </h2>
          <p style={{ fontSize: 13, color: "#57606a", lineHeight: 1.5 }}>
            When the Design Brief evolves, this page can be updated to stay aligned, keeping the narrative close to the
            data and dashboards.
          </p>
        </section>
      </main>
    </div>
  );
}

