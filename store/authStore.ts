"use client";

import { create } from "zustand";
import { authService } from "@/services/authService";
import { User, UserPreference } from "@/types/user";

interface AuthState {
  user: User | null;
  userPreferences: UserPreference | null;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void; // ✅ Kullanıcı bilgisini güncelleme fonksiyonu
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userPreferences: null,
  isLoading: false,
  error: null,
  isEmailVerified: false,

  setUser: (user) => set({ user, userPreferences: user?.preferences || null, isEmailVerified: user?.emailVerified || false }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password); // ✅ Backend cookie'ye token ekliyor
      const user = await authService.getCurrentUser(); // ✅ Kullanıcı bilgilerini çek
      if (user) set({ user, userPreferences: user.preferences || null, isEmailVerified: user.emailVerified, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const success = await authService.register(userData);
      if (success) {
        const user = await authService.getCurrentUser(); // ✅ Kullanıcı bilgilerini çek
        if (user) set({ user, userPreferences: user.preferences || null, isEmailVerified: user.emailVerified, isLoading: false });
        return true;
      } else {
        set({ isLoading: false, error: "Kayıt başarısız. Lütfen tekrar deneyin." });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Kayıt başarısız.",
        isLoading: false,
      });
      return false;
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await authService.verifyEmail(token);
      set({ isEmailVerified: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "E-posta doğrulama başarısız.",
        isLoading: false,
        isEmailVerified: false,
      });
    }
  },

  refreshToken: async () => {
    try {
      console.log("Token yenileme işlemi başladı.");
      await authService.refreshToken(); // ✅ Backend cookie içinde yeni access token dönecek
      const user = await authService.getCurrentUser(); // ✅ Kullanıcı bilgilerini tekrar al
      if (user) set({ user, userPreferences: user.preferences || null, isEmailVerified: user.emailVerified, isLoading: false });
    } catch (error: any) {
      console.error("Token yenileme hatası:", error.message);
      set({
        error: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        user: null,
        userPreferences: null,
        isEmailVerified: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.error("Çıkış işlemi başarısız:", error);
    } finally {
      set({ user: null, userPreferences: null, isEmailVerified: false, error: null });
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestPasswordReset(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Şifre sıfırlama isteği başarısız.",
        isLoading: false,
      });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(token, newPassword);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Şifre sıfırlama başarısız.",
        isLoading: false,
      });
    }
  },
}));
