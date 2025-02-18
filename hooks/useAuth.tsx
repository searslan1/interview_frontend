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
    resetPassword,
  } = useAuthStore();

  useEffect(() => {
    if (!user) {
      refreshToken().catch(() => {}); // ❌ Hata olursa kullanıcıyı atmasın, loglasın
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
