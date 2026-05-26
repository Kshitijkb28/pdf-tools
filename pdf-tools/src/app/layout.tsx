import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MR Consultancy PDF - Free Online PDF Tools",
    template: "%s | MR Consultancy PDF",
  },
  description:
    "Free online PDF tools to merge, split, compress, convert, rotate, watermark, and more. No signup required. All processing happens in your browser.",
  keywords: ["pdf", "merge", "split", "compress", "convert", "free", "online", "pdf tools", "watermark", "rotate"],
  manifest: "/manifest.json",
  openGraph: {
    title: "MR Consultancy PDF - Free Online PDF Tools",
    description: "Free, fast, and secure PDF tools. All processing happens in your browser.",
    type: "website",
    siteName: "MR Consultancy PDF",
  },
  twitter: {
    card: "summary_large_image",
    title: "MR Consultancy PDF - Free Online PDF Tools",
    description: "Free, fast, and secure PDF tools. All processing happens in your browser.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 antialiased">
        {children}
      </body>
    </html>
  );
}
