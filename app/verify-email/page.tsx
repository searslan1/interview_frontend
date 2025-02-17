"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import AuthModal from "@/components/AuthModal";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, isEmailVerified, error, isLoading } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams, verifyEmail]);

  useEffect(() => {
    if (isEmailVerified) {
      setIsAuthModalOpen(true); // E-posta doğrulandıysa modal aç
      setTimeout(() => {
        router.push("/"); // 3 saniye sonra ana sayfaya yönlendir
      }, 3000);
    }
  }, [isEmailVerified, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">E-posta Doğrulama</h2>
        {isLoading && <p>Doğrulanıyor...</p>}
        {isEmailVerified ? (
          <p className="text-green-500">E-posta başarıyla doğrulandı! 🎉</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-600">E-posta doğrulama bekleniyor...</p>
        )}
      </div>

      {/* ✅ Login Modal Açılıyor */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
