"use client";

import dynamic from "next/dynamic";

const ProblemsView = dynamic(() => import("@/components/ProblemsView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function ProblemsPage() {
  return <ProblemsView />;
}
