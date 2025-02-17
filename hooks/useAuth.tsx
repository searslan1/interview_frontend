// hooks/useAuth.tsx
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useAuth = () => {
  const { 
    user, 
    isLoading, 
    error, 
    isEmailVerified, 
    login, 
    register, 
    verifyEmail, 
    refreshToken, 
    logout, 
    requestPasswordReset, 
    resetPassword
  } = useAuthStore();

  // Sayfa yüklendiğinde refresh token çağrısı yap
  useEffect(() => {
    if (!user) {
      refreshToken();
    }
  }, [user, refreshToken]);

  return {
    user,
    isLoading,
    error,
    isEmailVerified,
    isAuthenticated: !!user, // Kullanıcı oturum açık mı?
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset, // ✅ Şifre sıfırlama isteği eklendi
    resetPassword, // ✅ Şifre sıfırlama işlemi eklendi
  };
};
