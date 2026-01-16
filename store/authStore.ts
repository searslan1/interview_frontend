"use client";

import { create } from "zustand";
import { authService } from "@/services/authService";
import { User, UserPreference } from "@/types/user";
import { AUTH_CONFIG, calculateTokenExpiry } from "@/lib/auth.config";

interface AuthState {
  user: User | null;
  userPreferences: UserPreference | null;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userPreferences: null,
  isLoading: false,
  error: null,
  isEmailVerified: false,
  isInitialized: false,

  setUser: (user) => set({ 
    user, 
    userPreferences: user?.preferences || null, 
    isEmailVerified: user?.emailVerified || false 
  }),

  /**
   * Initialize auth state on app load
   */
  initialize: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ 
          user, 
          userPreferences: user.preferences || null, 
          isEmailVerified: user.emailVerified,
          isInitialized: true,
          isLoading: false 
        });
      } else {
        set({ isInitialized: true, isLoading: false });
      }
    } catch {
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const user = await authService.getCurrentUser();
      
      if (user) {
        // Token expiry'yi kaydet
        if (response?.data?.expiresIn && typeof window !== 'undefined') {
          const expiry = calculateTokenExpiry(response.data.expiresIn);
          localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
        }
        
        set({ 
          user, 
          userPreferences: user.preferences || null, 
          isEmailVerified: user.emailVerified, 
          isLoading: false 
        });
      }
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
      const response = await authService.refreshToken();
      
      if (response?.data?.expiresIn && typeof window !== 'undefined') {
        const expiry = calculateTokenExpiry(response.data.expiresIn);
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
      }
      
      const user = await authService.getCurrentUser();
      if (user) {
        set({ 
          user, 
          userPreferences: user.preferences || null, 
          isEmailVerified: user.emailVerified 
        });
      }
    } catch (error: any) {
      console.error("Token yenileme hatası:", error.message);
      // Session expired, logout
      get().logout();
    }
  },

  logout: () => {
    // Clear storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
    }
    
    set({ 
      user: null, 
      userPreferences: null, 
      isEmailVerified: false, 
      error: null 
    });
    
    // Redirect to landing page
    if (typeof window !== "undefined") {
      window.location.href = "/";
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
