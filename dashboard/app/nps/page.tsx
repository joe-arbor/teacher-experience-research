"use client";

import dynamic from "next/dynamic";

const NpsView = dynamic(() => import("@/components/NpsView"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center" }}>Loading NPS…</div>
  ),
});

export default function NpsPage() {
  return <NpsView />;
}
