"use client";

import { create } from "zustand";
import { produce } from "immer";
import { Application, ApplicationStatus } from "@/types/application";

interface ApplicationStore {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  
  fetchApplications: () => Promise<void>;
  getApplicationById: (id: string) => Application | undefined;
  addApplication: (application: Application) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  getApplicationsByInterviewId: (interviewId: string) => Application[];
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,

  // ✅ API'den başvuruları çek
  fetchApplications: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/applications");
      const data: Application[] = await response.json();
      set({ applications: data, isLoading: false });
    } catch (error) {
      set({ error: "Başvuruları çekerken bir hata oluştu.", isLoading: false });
    }
  },

  // ✅ Belirli bir başvuruyu ID ile getir
  getApplicationById: (id) => get().applications.find((app) => app.id === id),

  // ✅ Yeni başvuru ekleme
  addApplication: (application) => {
    set(produce((state: ApplicationStore) => {
      state.applications.push(application);
    }));
  },

  // ✅ Başvuru durumunu güncelleme
  updateApplicationStatus: (id, status) => {
    set(produce((state: ApplicationStore) => {
      const application = state.applications.find((app) => app.id === id);
      if (application) {
        application.status = status;
      }
    }));
  },

  // ✅ Belirli bir başvuruyu sil
  deleteApplication: (id) => {
    set(produce((state: ApplicationStore) => {
      state.applications = state.applications.filter((app) => app.id !== id);
    }));
  },

  // ✅ Belirli bir mülakat için başvuruları getir
  getApplicationsByInterviewId: (interviewId) => {
    return get().applications.filter((app) => app.interviewId === interviewId);
  },
}));
