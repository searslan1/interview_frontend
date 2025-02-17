// services/authService.ts
import api from "@/utils/api";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
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
      const response = await api.get("/auth/refresh");
      return response.data;
    } catch (error) {
      throw new Error("Token yenileme başarısız. Tekrar giriş yapmalısınız.");
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
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
