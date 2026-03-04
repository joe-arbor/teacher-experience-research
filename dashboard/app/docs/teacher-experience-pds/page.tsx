"use client";

export default function TeacherExperiencePDSPage() {
  return (
    <div style={{ padding: "32px 24px 48px", maxWidth: 900, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#24292f" }}>
          Teacher Experience PDS
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
            Problem statement
          </h2>
          <p style={{ fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            We receive consistent feedback that the teacher experience is a blocker to schools fully loving
            and recommending Arbor. We want to move schools away from using third party software and ensure
            that core activities take place within the MIS.
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
            Value to users and customers
          </h2>
          <p style={{ fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            Improving the UX of core teacher flows will help schools save time completing critical tasks,
            significantly reduce clicks, and increase everyday usage.
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
            Strategic business value
          </h2>
          <ol style={{ paddingLeft: 20, fontSize: 14, color: "#24292f", lineHeight: 1.5 }}>
            <li>Easier upsell to higher packages.</li>
            <li>Greater adoption of features.</li>
            <li>Higher stickiness across Behaviour, Attendance, and My Classroom.</li>
          </ol>
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
            This page is intended to mirror the content of <strong>Teacher Experience PDS.pdf</strong> inside the
            product. When the source document changes, this page can be updated to stay in sync.
          </p>
        </section>
      </main>
    </div>
  );
}

