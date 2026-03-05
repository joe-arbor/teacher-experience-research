"use client";

import dynamic from "next/dynamic";

const NpsHmwView = dynamic(() => import("@/components/NpsHmwView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function NpsHmwPage() {
  return <NpsHmwView />;
}
