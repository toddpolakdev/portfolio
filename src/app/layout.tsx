import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/Theme/ThemeScript";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toddpolak.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Todd Polak — Web Developer",
    template: "%s · Todd Polak",
  },
  description:
    "Web developer specializing in scalable web applications, serverless architectures, and CMS integrations. React, Next.js, GraphQL, MongoDB.",
  keywords: [
    "Todd Polak",
    "web developer",
    "React",
    "Next.js",
    "GraphQL",
    "TypeScript",
    "full stack",
  ],
  authors: [{ name: "Todd Polak" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Todd Polak — Web Developer",
    description:
      "Web developer specializing in scalable web applications, serverless architectures, and CMS integrations.",
    siteName: "Todd Polak",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todd Polak — Web Developer",
    description:
      "Web developer specializing in scalable web applications and serverless architectures.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0f10" },
    { media: "(prefers-color-scheme: light)", color: "#f4f2ed" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jetbrains.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* Scroll reveals depend on JS; without it, show everything. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
