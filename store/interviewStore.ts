"use client";

import { create } from "zustand";
import { produce } from "immer";
import { Interview } from "@/types/interview";

interface InterviewStore {
  interviews: Interview[];
  currentInterview: Interview | null;
  isLoading: boolean;
  error: string | null;

  fetchAllInterviews: () => Promise<void>;
  fetchMyInterviews: () => Promise<void>;
  fetchInterviewById: (id: string) => Promise<void>;
  createInterview: (data: Partial<Interview>) => Promise<void>;
  updateInterview: (id: string, updatedInterview: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;

  updateQuestionOrder: (interviewId: string, questionId: string, newOrder: number) => void;
  sortInterviews: (key: keyof Interview, order?: "asc" | "desc") => void;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  interviews: [],
  currentInterview: null,
  isLoading: false,
  error: null,

  // ✅ Tüm mülakatları getir (Admin yetkisi gerektirir)
  fetchAllInterviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/interview/all", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Mülakatlar alınamadı.");
      
      set({ interviews: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Kullanıcının mülakatlarını getir
  fetchMyInterviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/interview/my", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Kendi mülakatlarını alma başarısız.");

      set({ interviews: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Belirli bir mülakatı getir
  fetchInterviewById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/interview/${id}`, { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Mülakat bulunamadı.");

      set({ currentInterview: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, currentInterview: null });
    }
  },

  // ✅ Yeni mülakat oluştur
  createInterview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/interview/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Mülakat oluşturulamadı.");

      set((state) => ({
        interviews: [...state.interviews, result.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Mülakat güncelleme
  updateInterview: async (id, updatedInterview) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/interview/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInterview),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Mülakat güncellenemedi.");

      set(produce((state: InterviewStore) => {
        const index = state.interviews.findIndex((i) => i.id === id);
        if (index !== -1) {
          state.interviews[index] = { ...state.interviews[index], ...updatedInterview };
        }
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Mülakat silme
  deleteInterview: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/interview/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Mülakat silinemedi.");

      set(produce((state: InterviewStore) => {
        state.interviews = state.interviews.filter((interview) => interview.id !== id);
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Mülakat içindeki soruların sırasını güncelle
  updateQuestionOrder: (interviewId, questionId, newOrder) => {
    set(produce((state: InterviewStore) => {
      const interview = state.interviews.find((i) => i.id === interviewId);
      if (!interview) return;
      
      const questionIndex = interview.questions.findIndex((q) => q.id === questionId);
      if (questionIndex === -1) return;

      const [movedQuestion] = interview.questions.splice(questionIndex, 1);
      interview.questions.splice(newOrder - 1, 0, movedQuestion);

      interview.questions.forEach((q, index) => {
        q.order = index + 1;
      });
    }));
  },

  // ✅ Mülakatları belirli bir kritere göre sırala
  sortInterviews: (key, order = "asc") => {
    set(produce((state: InterviewStore) => {
      state.interviews.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (typeof valueA === "string" && typeof valueB === "string") {
          return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        if (typeof valueA === "number" && typeof valueB === "number") {
          return order === "asc" ? valueA - valueB : valueB - valueA;
        }
        return 0;
      });
    }));
  }
}));
