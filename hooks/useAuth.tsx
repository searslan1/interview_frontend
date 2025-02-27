import { useAuthStore, } from "@/store/authStore";
import { useEffect } from "react";
import { authService } from "@/services/authService";

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
    resetPassword,
    setUser, // ✅ Yeni eklenen fonksiyon
  } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ SSR hatalarını engelle

    if (!user) {
      authService.getCurrentUser()
        .then((fetchedUser) => {
          if (fetchedUser) setUser(fetchedUser); // ✅ Kullanıcı bilgilerini güncelle
        })
        .catch(() => {
          console.error("Kullanıcı bilgileri alınamadı.");
        });
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    isEmailVerified,
    isAuthenticated: !!user,
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
  };
};
