import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "@/lib/ApolloWrapper";
import FadeInObserver from "@/components/FadeInObserver";
import ScrollAnimations from "@/components/ScrollAnimations/ScrollAnimations";
import { Providers } from "@/components/Providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todd Polak - Portfolio",
  description: "Portfolio website for Todd Polak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ApolloWrapper>
          <Providers>
            <FadeInObserver />
            <ScrollAnimations />
            {children}
          </Providers>
        </ApolloWrapper>
      </body>
    </html>
  );
}
