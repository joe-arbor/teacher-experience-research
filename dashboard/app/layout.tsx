import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "./auth-context";
import { AuthGate } from "@/components/AuthGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Teacher Experience",
  description: "Central space for the Teacher Experience Product Discovery & Strategy project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <AuthProvider>
              <AuthGate>
                {children}
              </AuthGate>
            </AuthProvider>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
