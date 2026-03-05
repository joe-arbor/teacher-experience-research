"use client";

import dynamic from "next/dynamic";

const AcAiDraftView = dynamic(() => import("@/components/AcAiDraftView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function AcAiDraftPage() {
  return <AcAiDraftView />;
}

