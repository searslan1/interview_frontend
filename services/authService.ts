// services/authService.ts
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";
import { AUTH_CONFIG, calculateTokenExpiry } from "@/lib/auth.config";

interface RefreshResponse {
  success: boolean;
  data?: {
    expiresIn: number;
  };
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    
    // Token expiry'yi kaydet
    if (response.data?.data?.expiresIn && typeof window !== 'undefined') {
      const expiry = calculateTokenExpiry(response.data.data.expiresIn);
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    }
    
    return response.data;
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/profile/me");
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  async register(userData: { name: string; email: string; password: string; phone?: string }) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data.success;
    } catch (error) {
      throw error;
    }
  },

  async verifyEmail(token: string) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async refreshToken(): Promise<RefreshResponse | null> {
    try {
      const response = await api.post<RefreshResponse>("/auth/refresh");
      
      // Token expiry'yi güncelle
      if (response.data?.data?.expiresIn && typeof window !== 'undefined') {
        const expiry = calculateTokenExpiry(response.data.data.expiresIn);
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
      }
      
      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Her durumda local state'i temizle
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
      }
      useAuthStore.getState().logout();
    }
  },

  async requestPasswordReset(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },
};

