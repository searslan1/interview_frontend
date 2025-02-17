"use client";

import { create } from "zustand";
import api from "@/utils/api";
import { User, UserPreference } from "@/types/user";

interface AuthState {
  user: User | null;
  userPreferences: UserPreference | null;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
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
      const response = await api.post("/api/auth/login", { email, password });
      // Backend, { success: true, data: { user, preferences } } şeklinde dönüyor.
      if (!response.data.success) {
        throw new Error(response.data.message || "Giriş başarısız.");
      }
      set({
        user: response.data.data.user,
        userPreferences: response.data.data.preferences,
        isEmailVerified: response.data.data.user.emailVerified,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Giriş başarısız.",
        isLoading: false,
      });
    }
  },

  register: async ({ name, email, password, phone }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/api/auth/register", { name, email, password, phone });
      if (!response.data.success) {
        throw new Error(response.data.message || "Kayıt başarısız.");
      }
      // API'den dönen veride token varsa döndür.
      const data = response.data.data;
      set({
        user: data.user,
        userPreferences: data.preferences,
        isEmailVerified: false, // Yeni kayıtlar için
        isLoading: false,
      });
      return data; // Burada token ya da diğer verileri döndürebilirsin.
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Kayıt başarısız.",
        isLoading: false,
      });
      return null;
    }
  },
  

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/auth/verify-email?token=${token}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "E-posta doğrulama başarısız.");
      }
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
      const response = await api.get("/api/auth/refresh");
      if (!response.data.success) {
        throw new Error(response.data.message || "Token yenileme başarısız.");
      }
      set({
        user: response.data.data.user,
        userPreferences: response.data.data.preferences,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Token yenileme başarısız.",
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
      set({ user: null, userPreferences: null, isEmailVerified: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || "Çıkış hatası.",
      });
    }
  },
}));
