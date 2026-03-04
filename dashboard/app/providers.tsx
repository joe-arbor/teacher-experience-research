"use client";

import { useState, useEffect } from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-monolithic";
import { createLightTheme, BaseProvider } from "baseui";

const theme = createLightTheme(
  { primaryFontFamily: '"Inter", sans-serif' },
  {}
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [engine, setEngine] = useState<Styletron | null>(null);
  useEffect(() => {
    setEngine(new Styletron());
  }, []);
  if (!engine) {
    return <>{children}</>;
  }
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
