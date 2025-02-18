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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,  // ✅ Kullanıcıyı sakla
  userPreferences: null,
  isLoading: false,
  error: null,
  isEmailVerified: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify(data.data.user)); // ✅ Kullanıcıyı localStorage'a kaydet
      localStorage.setItem("token", data.data.token); // ✅ Token sakla
      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
        isEmailVerified: data.data.user.emailVerified,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Giriş başarısız.",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const success = await authService.register(userData);
      if (success) {
        set({ isLoading: false });
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
      const storedToken = localStorage.getItem("token"); // ✅ Token saklandığı yerden al
      if (!storedToken) throw new Error("Oturum süresi doldu.");

      const data = await authService.refreshToken();
      localStorage.setItem("token", data.data.token); // ✅ Yeni token güncelle
      localStorage.setItem("user", JSON.stringify(data.data.user));

      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
      });
    } catch (error: any) {
      set({
        error: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        user: null,
        userPreferences: null,
        isEmailVerified: false,
      });
      localStorage.removeItem("user");  // ✅ Çıkış yaparken localStorage temizle
      localStorage.removeItem("token");
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.error("Çıkış işlemi başarısız:", error);
    } finally {
      set({
        user: null,
        userPreferences: null,
        isEmailVerified: false,
        error: null,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestPasswordReset(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: "Şifre sıfırlama isteği başarısız.",
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
        error: "Şifre sıfırlama başarısız.",
        isLoading: false,
      });
    }
  },
}));
