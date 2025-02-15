"use client"



import { create } from "zustand"
import { mockReportingData } from "@/mockdata/mock-details-data"

interface ReportingStore {
  reportData: typeof mockReportingData
  isLoading: boolean
  error: string | null
  fetchReportData: () => Promise<void>
}

export const useReportingStore = create<ReportingStore>((set) => ({
  reportData: mockReportingData,
  isLoading: false,
  error: null,
  fetchReportData: async () => {
    set({ isLoading: true })
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      set({ reportData: mockReportingData, isLoading: false })
    } catch (error) {
      set({ error: "Failed to fetch reporting data", isLoading: false })
    }
  },
}))

