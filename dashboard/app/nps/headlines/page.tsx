"use client";

import dynamic from "next/dynamic";

const NpsHeadlinesView = dynamic(() => import("@/components/NpsHeadlinesView"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center" }}>Loading NPS Headlines…</div>
  ),
});

export default function NpsHeadlinesPage() {
  return <NpsHeadlinesView />;
}
