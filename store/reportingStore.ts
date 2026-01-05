// ========== REPORTING STORE ==========
// Rapor Sayfası Zustand Store

"use client";

import { create } from "zustand";
import type {
  ReportFilters,
  KPISummaryData,
  PositionAnalysisData,
  CandidateDistributionData,
  QuestionEffectivenessData,
  AIHRAlignmentData,
  TimeTrendsData,
  PositionOption,
  ReviewerOption,
  InterviewOption,
} from "@/types/report";

// ========== STORE STATE ==========

interface ReportingStoreState {
  // Filtreler
  filters: ReportFilters;
  
  // Veriler
  kpiSummary: KPISummaryData | null;
  positionAnalysis: PositionAnalysisData[];
  candidateDistribution: CandidateDistributionData | null;
  questionEffectiveness: QuestionEffectivenessData[];
  aiHrAlignment: AIHRAlignmentData | null;
  timeTrends: TimeTrendsData | null;
  
  // Filtre seçenekleri
  availablePositions: PositionOption[];
  availableReviewers: ReviewerOption[];
  availableInterviewTypes: InterviewOption[];
  
  // Yükleme durumları
  isLoading: boolean;
  isLoadingKPI: boolean;
  isLoadingPositions: boolean;
  isLoadingDistribution: boolean;
  isLoadingQuestions: boolean;
  isLoadingAlignment: boolean;
  isLoadingTrends: boolean;
  
  // Hata
  error: string | null;
  
  // Meta
  lastUpdated: string | null;
  
  // Legacy support
  reportData: any;
}

// ========== STORE ACTIONS ==========

interface ReportingStoreActions {
  // Filtre işlemleri
  setFilters: (filters: Partial<ReportFilters>) => void;
  resetFilters: () => void;
  setDatePreset: (preset: "30d" | "60d" | "90d" | "custom") => void;
  
  // Veri çekme
  fetchAllReportData: () => Promise<void>;
  fetchKPISummary: () => Promise<void>;
  fetchPositionAnalysis: () => Promise<void>;
  fetchCandidateDistribution: () => Promise<void>;
  fetchQuestionEffectiveness: () => Promise<void>;
  fetchAIHRAlignment: () => Promise<void>;
  fetchTimeTrends: () => Promise<void>;
  
  // Filtre seçeneklerini yükle
  fetchFilterOptions: () => Promise<void>;
  
  // Legacy support
  fetchReportData: () => Promise<void>;
  
  // Helpers
  clearError: () => void;
}

// ========== DEFAULT VALUES ==========

const getDateRange = (preset: "30d" | "60d" | "90d" | "custom"): { from: string; to: string } => {
  const to = new Date();
  const from = new Date();
  
  switch (preset) {
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "60d":
      from.setDate(from.getDate() - 60);
      break;
    case "90d":
      from.setDate(from.getDate() - 90);
      break;
    default:
      from.setDate(from.getDate() - 30);
  }
  
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
};

const defaultFilters: ReportFilters = {
  positions: [],
  dateRange: getDateRange("30d"),
  datePreset: "30d",
  tags: [],
  favoritesOnly: false,
};

// ========== MOCK DATA ==========

const mockKPISummary: KPISummaryData = {
  totalApplications: 1234,
  totalApplicationsChange: 12.5,
  evaluatedInterviews: 892,
  evaluatedInterviewsChange: 8.3,
  favoritesRate: 23.5,
  favoritesRateChange: -2.1,
  averageRoleFit: 68.4,
  averageRoleFitChange: 5.2,
  averageInterviewDuration: 24,
  averageInterviewDurationChange: -1.5,
};

const mockPositionAnalysis: PositionAnalysisData[] = [
  { position: "Yazılım Geliştirici", positionId: "pos1", highFit: 45, mediumFit: 120, lowFit: 65, total: 230, highFitPercent: 20, mediumFitPercent: 52, lowFitPercent: 28 },
  { position: "Ürün Yöneticisi", positionId: "pos2", highFit: 28, mediumFit: 85, lowFit: 42, total: 155, highFitPercent: 18, mediumFitPercent: 55, lowFitPercent: 27 },
  { position: "Veri Bilimci", positionId: "pos3", highFit: 35, mediumFit: 75, lowFit: 30, total: 140, highFitPercent: 25, mediumFitPercent: 54, lowFitPercent: 21 },
  { position: "UX Tasarımcı", positionId: "pos4", highFit: 22, mediumFit: 58, lowFit: 35, total: 115, highFitPercent: 19, mediumFitPercent: 50, lowFitPercent: 31 },
  { position: "DevOps Mühendisi", positionId: "pos5", highFit: 18, mediumFit: 45, lowFit: 27, total: 90, highFitPercent: 20, mediumFitPercent: 50, lowFitPercent: 30 },
];

const mockCandidateDistribution: CandidateDistributionData = {
  roleFitDistribution: [
    { bucket: "0-20", count: 45, percentage: 5, color: "#ef4444" },
    { bucket: "20-40", count: 120, percentage: 13, color: "#ef4444" },
    { bucket: "40-60", count: 285, percentage: 32, color: "#f59e0b" },
    { bucket: "60-80", count: 320, percentage: 36, color: "#22c55e" },
    { bucket: "80-100", count: 122, percentage: 14, color: "#22c55e" },
  ],
  communicationVsTechnical: Array.from({ length: 50 }, (_, i) => {
    const comm = Math.floor(Math.random() * 100);
    const tech = Math.floor(Math.random() * 100);
    const roleFit = Math.floor((comm + tech) / 2);
    return {
      id: `anon-${i}`,
      communication: comm,
      technical: tech,
      roleFit,
      color: roleFit >= 70 ? "#22c55e" : roleFit >= 40 ? "#f59e0b" : "#ef4444",
    };
  }),
};

const mockQuestionEffectiveness: QuestionEffectivenessData[] = [
  {
    questionId: "q1",
    questionText: "Bir projede karşılaştığınız en büyük teknik zorluk neydi?",
    shortText: "Bir projede karşılaştığınız en büyük...",
    interviewTitle: "Teknik Mülakat",
    discriminationIndex: 85,
    avgResponseTimeSec: 145,
    avgResponseTimeFormatted: "2 dk 25 sn",
    completionRate: 92,
    avgScore: 68,
    responseCount: 456,
    effectiveness: "high",
    color: "#22c55e",
  },
  {
    questionId: "q2",
    questionText: "Takım içi çatışmaları nasıl yönetirsiniz?",
    shortText: "Takım içi çatışmaları nasıl...",
    interviewTitle: "Kültür Uyumu",
    discriminationIndex: 78,
    avgResponseTimeSec: 120,
    avgResponseTimeFormatted: "2 dk",
    completionRate: 88,
    avgScore: 72,
    responseCount: 423,
    effectiveness: "high",
    color: "#22c55e",
  },
  {
    questionId: "q3",
    questionText: "Kendinizi 5 yıl sonra nerede görüyorsunuz?",
    shortText: "Kendinizi 5 yıl sonra nerede...",
    interviewTitle: "Kariyer Görüşmesi",
    discriminationIndex: 35,
    avgResponseTimeSec: 95,
    avgResponseTimeFormatted: "1 dk 35 sn",
    completionRate: 95,
    avgScore: 65,
    responseCount: 478,
    effectiveness: "low",
    color: "#ef4444",
  },
  {
    questionId: "q4",
    questionText: "Microservices mimarisinin avantajları nelerdir?",
    shortText: "Microservices mimarisinin avantajları...",
    interviewTitle: "Teknik Mülakat",
    discriminationIndex: 92,
    avgResponseTimeSec: 180,
    avgResponseTimeFormatted: "3 dk",
    completionRate: 75,
    avgScore: 58,
    responseCount: 312,
    effectiveness: "high",
    color: "#22c55e",
  },
  {
    questionId: "q5",
    questionText: "Agile metodolojileri hakkında deneyiminiz nedir?",
    shortText: "Agile metodolojileri hakkında...",
    interviewTitle: "Metodoloji Görüşmesi",
    discriminationIndex: 68,
    avgResponseTimeSec: 135,
    avgResponseTimeFormatted: "2 dk 15 sn",
    completionRate: 85,
    avgScore: 70,
    responseCount: 398,
    effectiveness: "medium",
    color: "#f59e0b",
  },
];

const mockAIHRAlignment: AIHRAlignmentData = {
  overallAlignment: 84,
  alignmentLevel: "high",
  metrics: {
    bothHigh: 156,
    aiOnlyHigh: 89,
    hrOnlyFavorite: 54,
    totalEvaluated: 892,
  },
  trend: [
    { period: "2024-10", date: "Ekim 2024", overlapPercent: 80 },
    { period: "2024-11", date: "Kasım 2024", overlapPercent: 82 },
    { period: "2024-12", date: "Aralık 2024", overlapPercent: 84 },
  ],
  categoryComparison: [
    { category: "Teknik Beceri", aiScore: 72, hrScore: 68, difference: 4, alignmentLevel: "aligned" },
    { category: "İletişim", aiScore: 65, hrScore: 70, difference: 5, alignmentLevel: "aligned" },
    { category: "Problem Çözme", aiScore: 78, hrScore: 75, difference: 3, alignmentLevel: "aligned" },
    { category: "Liderlik", aiScore: 58, hrScore: 62, difference: 4, alignmentLevel: "aligned" },
  ],
  categoryAlignments: [
    { category: "Teknik Beceri", aiScore: 72, hrScore: 68, difference: 4, alignmentLevel: "aligned" },
    { category: "İletişim", aiScore: 65, hrScore: 70, difference: 5, alignmentLevel: "aligned" },
    { category: "Problem Çözme", aiScore: 78, hrScore: 75, difference: 3, alignmentLevel: "aligned" },
    { category: "Liderlik", aiScore: 58, hrScore: 62, difference: 4, alignmentLevel: "aligned" },
  ],
  loading: false,
};

const mockTimeTrends: TimeTrendsData = {
  applicationQualityTrend: [
    { date: "2024-10-01", value: 62 },
    { date: "2024-10-15", value: 65 },
    { date: "2024-11-01", value: 68 },
    { date: "2024-11-15", value: 66 },
    { date: "2024-12-01", value: 71 },
    { date: "2024-12-15", value: 68 },
  ],
  averageFitTrend: [
    { date: "2024-10-01", value: 58 },
    { date: "2024-10-15", value: 61 },
    { date: "2024-11-01", value: 64 },
    { date: "2024-11-15", value: 62 },
    { date: "2024-12-01", value: 68 },
    { date: "2024-12-15", value: 68 },
  ],
  favoritesRateTrend: [
    { date: "2024-10-01", value: 18 },
    { date: "2024-10-15", value: 20 },
    { date: "2024-11-01", value: 22 },
    { date: "2024-11-15", value: 21 },
    { date: "2024-12-01", value: 25 },
    { date: "2024-12-15", value: 24 },
  ],
  applicationCountTrend: [
    { date: "2024-10-01", value: 180 },
    { date: "2024-10-15", value: 195 },
    { date: "2024-11-01", value: 210 },
    { date: "2024-11-15", value: 225 },
    { date: "2024-12-01", value: 205 },
    { date: "2024-12-15", value: 220 },
  ],
};

const mockPositionOptions: PositionOption[] = [
  { id: "pos1", name: "Yazılım Geliştirici", department: "Teknoloji", applicationCount: 230 },
  { id: "pos2", name: "Ürün Yöneticisi", department: "Ürün", applicationCount: 155 },
  { id: "pos3", name: "Veri Bilimci", department: "Veri", applicationCount: 140 },
  { id: "pos4", name: "UX Tasarımcı", department: "Tasarım", applicationCount: 115 },
  { id: "pos5", name: "DevOps Mühendisi", department: "Teknoloji", applicationCount: 90 },
];

const mockReviewerOptions: ReviewerOption[] = [
  { id: "rev1", name: "Ahmet Yılmaz", email: "ahmet@company.com" },
  { id: "rev2", name: "Ayşe Kaya", email: "ayse@company.com" },
  { id: "rev3", name: "Mehmet Demir", email: "mehmet@company.com" },
];

const mockInterviewTypes: InterviewOption[] = [
  { id: "type1", title: "Teknik Mülakat", positionName: "Yazılım Geliştirici", status: "active" },
  { id: "type2", title: "Kültür Uyumu", positionName: "Ürün Yöneticisi", status: "active" },
  { id: "type3", title: "Yönetici Görüşmesi", positionName: "Takım Lideri", status: "active" },
];

// Legacy mock data for backward compatibility
const mockLegacyReportData = {
  generalStatistics: mockKPISummary,
  candidateAnalysis: mockCandidateDistribution,
  interviewQualityAnalysis: mockQuestionEffectiveness,
  aiRecommendations: mockAIHRAlignment,
  visualizationsData: mockTimeTrends,
};

// ========== STORE IMPLEMENTATION ==========

export const useReportingStore = create<ReportingStoreState & ReportingStoreActions>()(
  (set, get) => ({
    // Initial State
    filters: defaultFilters,
    kpiSummary: null,
    positionAnalysis: [],
    candidateDistribution: null,
    questionEffectiveness: [],
    aiHrAlignment: null,
    timeTrends: null,
    availablePositions: [],
    availableReviewers: [],
    availableInterviewTypes: [],
    isLoading: false,
    isLoadingKPI: false,
    isLoadingPositions: false,
    isLoadingDistribution: false,
    isLoadingQuestions: false,
    isLoadingAlignment: false,
    isLoadingTrends: false,
    error: null,
    lastUpdated: null,
    reportData: mockLegacyReportData,

    // ========== FILTER ACTIONS ==========
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      }));
      // Filtre değiştiğinde tüm verileri yeniden çek
      get().fetchAllReportData();
    },

    resetFilters: () => {
      set({ filters: defaultFilters });
      get().fetchAllReportData();
    },

    setDatePreset: (preset) => {
      const dateRange = getDateRange(preset);
      set((state) => ({
        filters: { ...state.filters, datePreset: preset, dateRange },
      }));
      get().fetchAllReportData();
    },

    // ========== DATA FETCHING ==========
    fetchAllReportData: async () => {
      set({ isLoading: true, error: null });
      
      try {
        // Paralel olarak tüm verileri çek
        await Promise.all([
          get().fetchKPISummary(),
          get().fetchPositionAnalysis(),
          get().fetchCandidateDistribution(),
          get().fetchQuestionEffectiveness(),
          get().fetchAIHRAlignment(),
          get().fetchTimeTrends(),
        ]);
        
        set({ 
          isLoading: false,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error: any) {
        set({
          error: error.message || "Rapor verileri yüklenirken hata oluştu",
          isLoading: false,
        });
      }
    },

    fetchKPISummary: async () => {
      set({ isLoadingKPI: true });
      try {
        await new Promise((r) => setTimeout(r, 500));
        set({ kpiSummary: mockKPISummary, isLoadingKPI: false });
      } catch (error) {
        set({ isLoadingKPI: false });
        throw error;
      }
    },

    fetchPositionAnalysis: async () => {
      set({ isLoadingPositions: true });
      try {
        await new Promise((r) => setTimeout(r, 600));
        set({ positionAnalysis: mockPositionAnalysis, isLoadingPositions: false });
      } catch (error) {
        set({ isLoadingPositions: false });
        throw error;
      }
    },

    fetchCandidateDistribution: async () => {
      set({ isLoadingDistribution: true });
      try {
        await new Promise((r) => setTimeout(r, 700));
        set({ candidateDistribution: mockCandidateDistribution, isLoadingDistribution: false });
      } catch (error) {
        set({ isLoadingDistribution: false });
        throw error;
      }
    },

    fetchQuestionEffectiveness: async () => {
      set({ isLoadingQuestions: true });
      try {
        await new Promise((r) => setTimeout(r, 800));
        set({ questionEffectiveness: mockQuestionEffectiveness, isLoadingQuestions: false });
      } catch (error) {
        set({ isLoadingQuestions: false });
        throw error;
      }
    },

    fetchAIHRAlignment: async () => {
      set({ isLoadingAlignment: true });
      try {
        await new Promise((r) => setTimeout(r, 550));
        set({ aiHrAlignment: mockAIHRAlignment, isLoadingAlignment: false });
      } catch (error) {
        set({ isLoadingAlignment: false });
        throw error;
      }
    },

    fetchTimeTrends: async () => {
      set({ isLoadingTrends: true });
      try {
        await new Promise((r) => setTimeout(r, 650));
        set({ timeTrends: mockTimeTrends, isLoadingTrends: false });
      } catch (error) {
        set({ isLoadingTrends: false });
        throw error;
      }
    },

    fetchFilterOptions: async () => {
      try {
        await new Promise((r) => setTimeout(r, 300));
        set({
          availablePositions: mockPositionOptions,
          availableReviewers: mockReviewerOptions,
          availableInterviewTypes: mockInterviewTypes,
        });
      } catch (error) {
        console.error("Filter options fetch error:", error);
      }
    },

    // Legacy support
    fetchReportData: async () => {
      await get().fetchAllReportData();
    },

    clearError: () => {
      set({ error: null });
    },
  })
);

export default useReportingStore;
