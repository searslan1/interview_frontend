import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import ClientQueryProvider from "@/components/ClientQueryProvider";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "İK Yönetim Paneli",
  description: "İnsan Kaynakları Yönetim Paneli",
  generator: "SEAİ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ClientQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </ClientQueryProvider>
      </body>
    </html>
  );
}
