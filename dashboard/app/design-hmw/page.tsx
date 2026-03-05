"use client";

import dynamic from "next/dynamic";

const DesignHmwView = dynamic(() => import("@/components/DesignHmwView"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>,
});

export default function DesignHmwPage() {
  return <DesignHmwView />;
}
