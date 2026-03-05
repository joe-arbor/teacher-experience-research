"use client";

import dynamic from "next/dynamic";

const ProblemStatementsView = dynamic(() => import("@/components/ProblemStatementsView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function ProblemStatementsPage() {
  return <ProblemStatementsView />;
}
