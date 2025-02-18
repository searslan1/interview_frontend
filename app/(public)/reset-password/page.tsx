"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 Eğer token yoksa otomatik olarak giriş sayfasına yönlendir.
  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token as string, newPassword);
      setMessage(response.message || "Şifre başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
      
      setTimeout(() => {
        router.push("/");
      }, 3000); // 🚀 Kullanıcıya 3 saniye başarı mesajı göster
    } catch (err: any) {
      setError(err.response?.data?.message || "Şifre sıfırlama başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Yeni Şifre Belirle</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Input
          type="password"
          placeholder="Yeni Şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" className="w-full" disabled={loading || !newPassword.trim()}>
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;
