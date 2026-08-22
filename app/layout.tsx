import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { ScreenshotProtection } from "@/components/ScreenshotProtection"
import { PwaRegister } from "@/components/PwaRegister"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"),
  title: {
    default: "ADIM LAHAH MANDAWA - ADIM LAHAH MANDAWA",
    template: "%s | ADIM LAHAH MANDAWA",
  },
  description:
    "ADIM LAHAH MANDAWA - Official app of the ADIM LAHAH MANDAWA for members, fee collections, cash book, events and community updates.",
  keywords: [
    "adim",
    "mandawa",
    "lahah",
    "adim culture",
    "development association",
    "community",
  ],
  applicationName: "ADIM LAHAH MANDAWA",
  generator: "v0.app",
  authors: [{ name: "ADIM LAHAH MANDAWA" }],
  creator: "ADIM LAHAH MANDAWA",
  publisher: "ADIM LAHAH MANDAWA",
  category: "community",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "ADIM LAHAH MANDAWA",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ADIM LAHAH MANDAWA",
    title: "ADIM LAHAH MANDAWA",
    description:
      "Official app of the ADIM LAHAH MANDAWA for members, events, cash book and community updates.",
    images: ["/icon-512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADIM LAHAH MANDAWA",
    description:
      "Official app for members, events, cash book and community updates.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#128C7E" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ADIM LAHAH MANDAWA" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ScreenshotProtection />
        <PwaRegister />
        <AppShell>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </AppShell>
        <Toaster />
        {typeof window !== "undefined" && !window.hasOwnProperty("Capacitor") && <Analytics />}
      </body>
    </html>
  )
}