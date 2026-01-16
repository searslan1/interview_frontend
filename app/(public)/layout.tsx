"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
// Toaster root layout'ta zaten var, burada tekrar eklemeye gerek yok

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Eğer URL "/application" ile başlıyorsa bu bir Aday Mülakat sürecidir.
  // Bu durumda eski dar "Auth" kutusunu değil, tam ekran layout'u kullanacağız.
  const isCandidateFlow = pathname?.startsWith("/application");

  // ===============================================
  // 1. ADAY MÜLAKAT LAYOUT (Yeni)
  // ===============================================
  if (isCandidateFlow) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
        {/* Buraya Header/Logo koymuyoruz çünkü Landing, Exam ve Wizard 
            sayfalarının header ihtiyaçları farklı olabilir.
            Header kontrolünü sayfa (page) veya store seviyesinde yapacağız.
        */}
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  // ===============================================
  // 2. MEVCUT LEGACY LAYOUT (Eski Auth vb.)
  // ===============================================
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </main>
  );
}