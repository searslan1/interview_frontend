"use client";

import "../globals.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DashboardHeader from "@/components/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // 🚀 İlk render'da hydrate hatasını önlemek için
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🚀 Kullanıcı giriş yapmadıysa yönlendir
  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router, isMounted]);

  if (!isMounted) {
    return null; // 🚀 İlk render'da DOM manipülasyonu olmasın diye
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-gray-500 mt-4">Giriş kontrol ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
