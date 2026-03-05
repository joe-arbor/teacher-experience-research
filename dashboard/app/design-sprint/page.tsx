"use client";

import dynamic from "next/dynamic";

const DesignSprintView = dynamic(() => import("@/components/DesignSprintView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function DesignSprintPage() {
  return <DesignSprintView />;
}
