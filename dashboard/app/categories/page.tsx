"use client";

import dynamic from "next/dynamic";

const CategoriesView = dynamic(() => import("@/components/CategoriesView"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center" }}>Loading…</div>
  ),
});

export default function CategoriesPage() {
  return <CategoriesView />;
}
