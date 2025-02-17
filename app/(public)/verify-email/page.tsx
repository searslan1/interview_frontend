"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/authService"; // ✅ Import yolu düzeltildi

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Doğrulama tokeni eksik!");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token); // ✅ Doğru fonksiyon çağrıldı
        setMessage(response.message || "E-posta başarıyla doğrulandı!");
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Doğrulama başarısız.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading ? (
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold">{message}</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Giriş Yap
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
