"use client"


import { create } from "zustand"
import { dashboardMockData } from "@/mockdata/dashboardData"

interface DashboardStore {
  applicationTrends: { date: string; count: number }[]
  departmentApplications: { department: string; count: number }[]
  candidateProfiles: { experience: string; count: number }[]
  favoriteCandidates: { id: number; name: string; position: string; score: number }[]
  fetchDashboardData: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  applicationTrends: [],
  departmentApplications: [],
  candidateProfiles: [],
  favoriteCandidates: [],
  fetchDashboardData: async () => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    set(dashboardMockData)
  },
}))

