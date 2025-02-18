"use client";

import { create } from "zustand";
import { profileService } from "@/services/profileService";
import { User } from "@/types/user";

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (profileData: { name?: string; phone?: string; bio?: string }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.getProfile();
      set({ user: response.data, isLoading: false });
    } catch {
      set({ error: "Profil yüklenemedi.", isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      await profileService.updateProfile(profileData);
      await useProfileStore.getState().getProfile(); // ✅ Güncellenmiş profili tekrar çek
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Profil güncellenirken hata oluştu.",
        isLoading: false,
      });
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await profileService.changePassword(oldPassword, newPassword);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Şifre değiştirme başarısız.",
        isLoading: false,
      });
    }
  },

  uploadProfilePicture: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.uploadProfilePicture(file);
      set({
        user: { ...useProfileStore.getState().user!, profilePicture: response.data.profilePicture },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Profil fotoğrafı yüklenemedi.",
        isLoading: false,
      });
    }
  },
}));
