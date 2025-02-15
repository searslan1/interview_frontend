"use client";

import { create } from "zustand";
import { produce } from "immer";
import { mockInterviews } from "@/mockdata/mockInterviews";
import { Interview } from "@/types/interview";

interface InterviewStore {
  interviews: Interview[];
  isLoading: boolean;
  error: string | null;
  fetchInterviews: () => Promise<void>;
  getInterviewById: (id: string) => Interview | undefined;
  addInterview: (interview: Interview) => void;
  updateInterview: (id: string, updatedInterview: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  updateQuestionOrder: (interviewId: string, questionId: string, newOrder: number) => void;
  sortInterviews: (key: keyof Interview, order?: "asc" | "desc") => void;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  interviews: [],
  isLoading: false,
  error: null,

  // ✅ API veya Mock verilerden mülakatları getir
  fetchInterviews: async () => {
    set({ isLoading: true });
    try {
      // Gerçek API entegrasyonu varsa buraya fetch çağrısı yapılabilir.
      // const response = await fetch("/api/interviews");
      // const data: Interview[] = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simülasyon
      set({ interviews: mockInterviews, isLoading: false });
    } catch (error) {
      set({ error: "Mülakatları getirirken bir hata oluştu", isLoading: false });
    }
  },

  // ✅ Belirli bir mülakatı ID ile getir
  getInterviewById: (id) => get().interviews.find((interview) => interview.id === id),

  // ✅ Yeni mülakat ekleme
  addInterview: (interview) => {
    set(produce((state: InterviewStore) => {
      state.interviews.push(interview);
    }));
  },

  // ✅ Mülakat güncelleme
  updateInterview: (id, updatedInterview) => {
    set(produce((state: InterviewStore) => {
      const interview = state.interviews.find((i) => i.id === id);
      if (interview) {
        Object.assign(interview, updatedInterview);
      }
    }));
  },

  // ✅ Mülakat silme
  deleteInterview: (id) => {
    set(produce((state: InterviewStore) => {
      state.interviews = state.interviews.filter((interview) => interview.id !== id);
    }));
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
