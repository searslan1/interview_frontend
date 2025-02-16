"use client";

import { create } from "zustand";
import type { Candidate } from "@/types/candidate";

interface CandidateStore {
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<void>;
  getCandidateById: (id: string) => Candidate | undefined;
  updateCandidateStatus: (id: string, status: Candidate["status"]) => Promise<void>;
}

export const useCandidateStore = create<CandidateStore>((set, get) => ({
  candidates: [],
  isLoading: false,
  error: null,

  fetchCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/candidates");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Candidate[] = await res.json();
      set({ candidates: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch candidates", isLoading: false });
    }
  },

  getCandidateById: (id: string) => {
    return get().candidates.find((candidate) => candidate.id === id);
  },

  updateCandidateStatus: async (id: string, status: Candidate["status"]) => {
    try {
      // Optimistic update: önce state güncelleniyor.
      set((state) => ({
        candidates: state.candidates.map((candidate) =>
          candidate.id === id ? { ...candidate, status } : candidate
        ),
      }));

      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update candidate status");
      }
    } catch (error) {
      set({ error: "Failed to update candidate status" });
    }
  },
}));
