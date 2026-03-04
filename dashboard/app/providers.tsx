"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-monolithic";
import { createLightTheme, BaseProvider } from "baseui";

const theme = createLightTheme({ primaryFontFamily: '"Inter", sans-serif' });

const ThemeReadyContext = createContext(false);

export function useThemeReady() {
  return useContext(ThemeReadyContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [engine, setEngine] = useState<Styletron | null>(null);
  useEffect(() => {
    setEngine(new Styletron());
  }, []);
  if (!engine) {
    return (
      <ThemeReadyContext.Provider value={false}>
        {children}
      </ThemeReadyContext.Provider>
    );
  }
  return (
    <ThemeReadyContext.Provider value={true}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>{children}</BaseProvider>
      </StyletronProvider>
    </ThemeReadyContext.Provider>
  );
}
