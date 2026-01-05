"use client";

import { create } from "zustand";

interface ApplicationTrend {
  date: string;
  count: number;
}

interface DepartmentApplication {
  department: string;
  count: number;
}

interface CandidateProfile {
  experience: string;
  count: number;
}

export interface FavoriteCandidate {
  id: string;
  name: string;
  position: string;
  score: number;
  addedAt?: string; // Favoriye eklenme tarihi
}

interface DashboardStore {
  applicationTrends: ApplicationTrend[];
  departmentApplications: DepartmentApplication[];
  candidateProfiles: CandidateProfile[];
  favoriteCandidates: FavoriteCandidate[];
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  applicationTrends: [],
  departmentApplications: [],
  candidateProfiles: [],
  favoriteCandidates: [],

  fetchDashboardData: async () => {
    try {
      const response = await fetch("/interviews/dashboard"); // ✅ Gerçek API'den veri çeker
      if (!response.ok) {
        throw new Error("Dashboard verileri yüklenemedi.");
      }
      const data = await response.json();

      set({
        applicationTrends: data.applicationTrends || [],
        departmentApplications: data.departmentApplications || [],
        candidateProfiles: data.candidateProfiles || [],
        favoriteCandidates: data.favoriteCandidates || [],
      });
    } catch (error) {
      console.error("Dashboard verileri alınırken hata oluştu:", error);
      set({
        applicationTrends: [],
        departmentApplications: [],
        candidateProfiles: [],
        favoriteCandidates: [],
      });
    }
  },
}));
