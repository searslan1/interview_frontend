"use client"


import { create } from "zustand"
import { mockCandidates, type Candidate } from "@/mockdata/candidates"

interface CandidateStore {
  candidates: Candidate[]
  isLoading: boolean
  error: string | null
  fetchCandidates: () => Promise<void>
  getCandidateById: (id: string) => Candidate | undefined
  updateCandidateStatus: (id: string, status: Candidate["status"]) => void
}

export const useCandidateStore = create<CandidateStore>((set, get) => ({
  candidates: [],
  isLoading: false,
  error: null,
  fetchCandidates: async () => {
    set({ isLoading: true })
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({ candidates: mockCandidates, isLoading: false })
    } catch (error) {
      set({ error: "Failed to fetch candidates", isLoading: false })
    }
  },
  getCandidateById: (id: string) => {
    return get().candidates.find((candidate) => candidate.id === id)
  },
  updateCandidateStatus: (id: string, status: Candidate["status"]) => {
    set((state) => ({
      candidates: state.candidates.map((candidate) => (candidate.id === id ? { ...candidate, status } : candidate)),
    }))
  },
}))

