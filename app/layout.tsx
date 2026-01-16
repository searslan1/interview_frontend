import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import ClientQueryProvider from "@/components/ClientQueryProvider";
import type React from "react";
import type { Metadata, Viewport } from "next";

// Font optimizasyonu - display: swap ile FOUT önleme
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// Metadata - SEO ve sosyal medya için
export const metadata: Metadata = {
  title: {
    default: "İK Yönetim Paneli",
    template: "%s | İK Yönetim Paneli",
  },
  description: "AI destekli İnsan Kaynakları Yönetim Paneli - Mülakat yönetimi, aday değerlendirme ve analiz platformu",
  keywords: ["İK", "mülakat", "insan kaynakları", "aday değerlendirme", "AI analiz"],
  authors: [{ name: "SEAİ Team" }],
  creator: "SEAİ",
  publisher: "SEAİ",
  robots: {
    index: true,
    follow: true,
  },
  // Open Graph
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "İK Yönetim Paneli",
    title: "İK Yönetim Paneli",
    description: "AI destekli İnsan Kaynakları Yönetim Paneli",
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "İK Yönetim Paneli",
    description: "AI destekli İnsan Kaynakları Yönetim Paneli",
  },
  // Manifest ve icons
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Viewport - mobil optimizasyon
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch - API ve CDN için */}
        <link rel="dns-prefetch" href="//localhost:5000" />
        <link rel="preconnect" href="//localhost:5000" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <ClientQueryProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ClientQueryProvider>
      </body>
    </html>
  );
}
