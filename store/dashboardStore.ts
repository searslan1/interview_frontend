"use client";

import { create } from "zustand";
import { dashboardService } from "@/services/dashboardService";
import type {
  DashboardResponse,
  DashboardStats,
  ApplicationTrend,
  WeeklyTrendData,
  RecentApplication,
  ActiveInterview,
  DepartmentStats,
  StatusDistribution
} from "@/types/dashboard";

export interface FavoriteCandidate {
  id: string;
  name: string;
  position: string;
  score: number;
  addedAt?: string;
}

interface DashboardStore {
  // Data
  stats: DashboardStats | null;
  applicationTrend: ApplicationTrend | null;
  weeklyTrends: WeeklyTrendData[];
  recentApplications: RecentApplication[];
  activeInterviews: ActiveInterview[];
  departmentStats: DepartmentStats[];
  favoriteApplications: RecentApplication[];
  statusDistribution: StatusDistribution[];
  notifications: any[];
  
  // Legacy data (deprecated, eski componentler için)
  applicationTrends: { date: string; count: number }[];
  departmentApplications: { department: string; count: number }[];
  candidateProfiles: { experience: string; count: number }[];
  favoriteCandidates: FavoriteCandidate[];
  
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  toggleFavorite: (applicationId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  stats: null,
  applicationTrend: null,
  weeklyTrends: [],
  recentApplications: [],
  activeInterviews: [],
  departmentStats: [],
  favoriteApplications: [],
  statusDistribution: [],
  notifications: [],
  
  // Legacy
  applicationTrends: [],
  departmentApplications: [],
  candidateProfiles: [],
  favoriteCandidates: [],
  
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const data: DashboardResponse = await dashboardService.getDashboardData();

      // Legacy format'a dönüştür (eski componentler için)
      const applicationTrends = data.weeklyTrends.map(w => ({
        date: w.weekLabel,
        count: w.applicationCount
      }));
      
      const departmentApplications = data.departmentStats.map(d => ({
        department: d.department,
        count: d.applicationCount
      }));
      
      const favoriteCandidates = data.favoriteApplications.slice(0, 5).map(app => ({
        id: app._id,
        name: app.candidateName,
        position: app.interviewTitle,
        score: app.aiScore || 0,
        addedAt: app.createdAt
      }));

      set({
        stats: data.stats,
        applicationTrend: data.applicationTrend,
        weeklyTrends: data.weeklyTrends,
        recentApplications: data.recentApplications,
        activeInterviews: data.activeInterviews,
        departmentStats: data.departmentStats,
        favoriteApplications: data.favoriteApplications,
        statusDistribution: data.statusDistribution,
        notifications: data.notifications,
        
        // Legacy
        applicationTrends,
        departmentApplications,
        favoriteCandidates,
        candidateProfiles: [], // Backend'de yok, boş bırak
        
        loading: false
      });
    } catch (error: any) {
      console.error("Dashboard verileri alınırken hata:", error);
      set({
        error: error.response?.data?.message || "Dashboard verileri yüklenemedi",
        loading: false
      });
    }
  },
  
  toggleFavorite: async (applicationId: string) => {
    try {
      await dashboardService.toggleFavorite(applicationId);
      
      // Favori durumunu local state'te güncelle
      set((state) => ({
        recentApplications: state.recentApplications.map(app =>
          app._id === applicationId ? { ...app, isFavorite: !app.isFavorite } : app
        ),
        favoriteApplications: state.favoriteApplications.filter(app => app._id !== applicationId)
      }));
      
      // Dashboard'u yeniden yükle
      get().fetchDashboardData();
    } catch (error: any) {
      console.error("Favori toggle hatası:", error);
      set({ error: error.response?.data?.message || "Favori güncelleme başarısız" });
    }
  }
}));
