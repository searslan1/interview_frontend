"use client";

import { create } from "zustand";
import { User, UserPreference } from "@/types/user";

interface AuthState {
  user: User | null;
  userPreferences: UserPreference | null;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean; // ✅ E-posta doğrulama durumu
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>; // ✅ Yeni fonksiyon
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userPreferences: null,
  isLoading: false,
  error: null,
  isEmailVerified: false, // ✅ Varsayılan olarak "false"

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Giriş başarısız.");

      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
        isEmailVerified: data.data.user.emailVerified, // ✅ Kullanıcı e-posta doğrulandı mı?
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Kayıt başarısız.");

      set({
        user: data.data.user,
        userPreferences: data.data.preferences,
        isEmailVerified: false, // ✅ Yeni kayıt olan biri henüz doğrulanmamıştır.
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: "GET",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "E-posta doğrulama başarısız.");

      set({ isEmailVerified: true, isLoading: false }); // ✅ E-posta doğrulama başarılı
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isEmailVerified: false });
    }
  },

  refreshToken: async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Token yenileme başarısız.");

      set({ user: data.data.user, userPreferences: data.data.preferences });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      set({ user: null, userPreferences: null, isEmailVerified: false });
    } catch (error: any) {
      console.error("Çıkış hatası:", error.message);
    }
  },
}));
