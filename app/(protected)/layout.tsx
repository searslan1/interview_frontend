"use client";
import "../globals.css"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; // Yükleme animasyonu
import DashboardHeader from "@/components/Header"; // Korumalı alanlar için header

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/"); // `replace` ile tarayıcı geri gitmeyi engeller.
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LoadingSpinner /> {/* Daha iyi bir yükleme ekranı */}
        <p className="text-gray-500 mt-4">Giriş kontrol ediliyor...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Kullanıcı yönlendirilene kadar boş döndür.
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow">
        <DashboardHeader /> {/* Kullanıcıya özel header */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
