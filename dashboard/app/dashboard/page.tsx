"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center" }}>Loading dashboard…</div>
  ),
});

export default function DashboardPage() {
  return <Dashboard />;
}
