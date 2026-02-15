import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pomotimerx.vercel.app"),
  title: "PomotimerX",
  description:
    "Pomodoro timer with YouTube music playback. Assign tracks to Work, Short Break, and Long Break sessions.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PomotimerX",
    description:
      "Pomodoro timer with YouTube music playback. Assign tracks to Work, Short Break, and Long Break sessions.",
    url: "https://pomotimerx.vercel.app",
    siteName: "PomotimerX",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "PomotimerX logo" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PomotimerX",
    description:
      "Pomodoro timer with YouTube music playback. Assign tracks to Work, Short Break, and Long Break sessions.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
