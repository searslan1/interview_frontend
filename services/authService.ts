// services/authService.ts
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/profile/me"); // ✅ Yeni endpoint'e yönlendirildi
      return response.data.data; // ✅ Backend'den gelen kullanıcı bilgilerini al
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

  async refreshToken() {
    try {
      await api.post("/auth/refresh"); // ✅ Backend yeni token'ı cookie'ye yazacak
      return await this.getCurrentUser(); // ✅ Kullanıcı bilgilerini tekrar al
    } catch (error) {
      throw new Error("Token yenileme başarısız. Tekrar giriş yapmalısınız.");
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
      useAuthStore.getState().logout(); // ✅ State sıfırla
    } catch (error) {
      throw new Error("Çıkış yaparken hata oluştu.");
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
