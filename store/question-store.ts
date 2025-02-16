"use client";

import { create } from "zustand";
import { InterviewQuestion } from "@/types/interview";

interface QuestionStore {
  questions: InterviewQuestion[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  isLoading: false,
  error: null,

  fetchQuestions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/questions");
      const data: InterviewQuestion[] = await response.json();
      set({ questions: data, isLoading: false });
    } catch (error) {
      set({ error: "Sorular alınırken hata oluştu", isLoading: false });
    }
  },
}));
