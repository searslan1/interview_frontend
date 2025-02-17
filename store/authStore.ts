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
  user: null,
  userPreferences: null,
  isLoading: false,
  error: null,
  isEmailVerified: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
        isEmailVerified: data.data.user.emailVerified,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Giriş başarısız.",
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
        set({ isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Kayıt başarısız.",
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
        error: error.response?.data?.message || error.message || "E-posta doğrulama başarısız.",
        isLoading: false,
        isEmailVerified: false,
      });
    }
  },

  refreshToken: async () => {
    try {
      const data = await authService.refreshToken();
      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
      });
    } catch (error: any) {
      set({
        error: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        user: null, // Kullanıcıyı temizle
        userPreferences: null,
        isEmailVerified: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, userPreferences: null, isEmailVerified: false, error: null });
    } catch (error: any) {
      set({
        error: "Çıkış yaparken hata oluştu.",
      });
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestPasswordReset(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Şifre sıfırlama başarısız.",
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
        error: error.response?.data?.message || error.message || "Şifre sıfırlama başarısız.",
        isLoading: false,
      });
    }
  },
}));
