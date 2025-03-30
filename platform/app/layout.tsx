import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProvider from "@/providers/root-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Chainhook - Solana Indexing Platform",
    template: "%s | Chainhook",
  },
  description:
    "Build and manage Solana index subscriptions with ease. Chainhook helps you track and index on-chain data efficiently.",
  keywords: [
    "Solana",
    "Blockchain",
    "Indexing",
    "Web3",
    "Database",
    "PostgreSQL",
    "Helius",
    "Chainhook",
  ],
  authors: [{ name: "Chainhook" }],
  creator: "Chainhook",
  publisher: "Chainhook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // metadataBase: new URL("https://chainhook.xyz"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chainhook",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chainhook.org",
    title: "Chainhook - Solana Indexing Platform",
    description:
      "Build and manage Solana index subscriptions with ease. Chainhook helps you track and index on-chain data efficiently.",
    siteName: "Chainhook",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chainhook - Solana Indexing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chainhook - Solana Indexing Platform",
    description:
      "Build and manage Solana index subscriptions with ease. Chainhook helps you track and index on-chain data efficiently.",
    images: ["/og-image.png"],
    creator: "@chainhook",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
