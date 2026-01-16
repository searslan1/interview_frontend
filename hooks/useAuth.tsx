import { useAuthStore } from "@/store/authStore";

/**
 * Modern Auth Hook
 * AuthProvider tarafından manage edilen auth durumunu expose eder
 */
export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isEmailVerified,
    isInitialized,
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
    setUser,
  } = useAuthStore();

  return {
    // Auth State
    user,
    isLoading,
    error,
    isEmailVerified,
    isInitialized,
    isAuthenticated: !!user,
    
    // Auth Actions
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
    
    // Internal
    setUser,
  };
};
