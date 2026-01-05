// ========================================
// REPORT TYPES - Frontend Integration Layer
// ========================================
// Backend API response tiplerini korur,
// UI ViewModel, enum ve ortak state tiplerini ekler.
// Date yerine ISO string kullanır.

// ========================================
// ENUMS & CONSTANTS
// ========================================

/**
 * Tarih aralığı preset seçenekleri
 */
export type DatePreset = "7d" | "30d" | "60d" | "90d" | "custom";

/**
 * Aday etiketleri
 */
export type CandidateTag = "strong" | "medium" | "weak";

/**
 * Başvuru durumları
 */
export type ApplicationStatus = "pending" | "completed" | "accepted" | "rejected";

/**
 * Trend aralık tipleri
 */
export type TrendInterval = "daily" | "weekly" | "monthly";

/**
 * Fit seviye kategorileri
 */
export type FitLevel = "high" | "medium" | "low";

/**
 * Skor eşik değerleri
 */
export const SCORE_THRESHOLDS = {
  HIGH_FIT: 70,    // score >= 70
  MEDIUM_FIT: 40,  // 40 <= score < 70
  LOW_FIT: 0,      // score < 40
} as const;

// ========================================
// ORTAK UI STATE TİPLERİ
// ========================================

/**
 * Generic loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched?: string; // ISO timestamp
}

/**
 * Pagination meta bilgileri
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ========================================
// FİLTRE TİPLERİ
// ========================================

/**
 * Backend API Filtre Parametreleri
 * Backend'e gönderilen query params
 */
export interface IReportFilters {
  positionIds?: string[];
  interviewIds?: string[];
  startDate?: string; // ISO format: "2024-01-01"
  endDate?: string;   // ISO format: "2024-03-31"
  reviewerIds?: string[];
  tags?: CandidateTag[];
  onlyFavorites?: boolean;
  status?: ApplicationStatus[];
}

/**
 * Frontend UI Filtre State
 * UI bileşenlerinde kullanılan filtre durumu
 */
export interface ReportFiltersState {
  // Pozisyon (multi-select)
  positions: string[];
  
  // Tarih aralığı
  dateRange: {
    from: string; // ISO string
    to: string;   // ISO string
  };
  
  // Tarih preset
  datePreset: DatePreset;
  
  // Mülakat ID'leri
  interviewIds?: string[];
  
  // Reviewer (HR kullanıcısı)
  reviewerIds?: string[];
  
  // Etiket (Strong / Medium / Weak)
  tags: CandidateTag[];
  
  // Sadece favoriler
  favoritesOnly: boolean;
  
  // Durum filtresi
  status?: ApplicationStatus[];
}

/**
 * Filtre State -> API Query dönüşümü için helper
 */
export function filtersToApiQuery(filters: ReportFiltersState): IReportFilters {
  return {
    positionIds: filters.positions.length > 0 ? filters.positions : undefined,
    interviewIds: filters.interviewIds?.length ? filters.interviewIds : undefined,
    startDate: filters.dateRange.from || undefined,
    endDate: filters.dateRange.to || undefined,
    reviewerIds: filters.reviewerIds?.length ? filters.reviewerIds : undefined,
    tags: filters.tags.length > 0 ? filters.tags : undefined,
    onlyFavorites: filters.favoritesOnly || undefined,
    status: filters.status?.length ? filters.status : undefined,
  };
}

// ========================================
// BACKEND API RESPONSE TİPLERİ
// ========================================

/**
 * 3.1 Özet KPI Şeridi Response
 * GET /api/reports/summary
 */
export interface ISummaryResponse {
  totalInterviews: number;
  evaluatedInterviews: number;
  pendingInterviews: number;
  completedApplications: number;
  favoriteRatio: number;        // 0-1 arası
  avgOverallScore: number;      // 0-100
  avgTechnicalScore: number;    // 0-100
  avgCommunicationScore: number; // 0-100
  avgInterviewDurationSec: number;
}

/**
 * 3.2 Pozisyon Bazlı Dağılım Item
 */
export interface IPositionDistributionItem {
  positionId: string;
  positionName: string;
  department?: string;
  distribution: {
    highFit: number;    // score >= 70
    mediumFit: number;  // 40 <= score < 70
    lowFit: number;     // score < 40
  };
  totalApplications: number;
}

/**
 * 3.2 Pozisyon Bazlı Dağılım Response
 * GET /api/reports/position-distribution
 */
export interface IPositionDistributionResponse {
  positions: IPositionDistributionItem[];
}

/**
 * 3.3 Fit Bucket (Histogram için)
 */
export interface IFitBucket {
  range: string;       // "0-20", "20-40", vb.
  count: number;
  percentage: number;  // 0-100
}

/**
 * 3.3 Skill Scatter Point
 */
export interface ISkillScatterPoint {
  communication: number;
  technical: number;
  problemSolving: number;
}

/**
 * 3.3 Rol Yakınlığı & Yetkinlik Dağılımı Response
 * GET /api/reports/fit-distribution
 */
export interface IFitDistributionResponse {
  roleFitBuckets: IFitBucket[];
  avgScores: {
    technical: number;
    communication: number;
    problemSolving: number;
    personality: number;
  };
  skillScatter: ISkillScatterPoint[];
}

/**
 * 3.4 Soru Etkinlik Item
 */
export interface IQuestionEffectivenessItem {
  questionId: string;
  questionText: string;
  interviewTitle: string;
  varianceScore: number;          // 0-1 arası (ayırt edicilik)
  avgAnswerDurationSec: number;
  analysisCompletionRate: number; // 0-1 arası
  avgScore: number;               // 0-100
  responseCount: number;
}

/**
 * 3.4 Soru Bazlı Ayırt Edicilik Response
 * GET /api/reports/question-effectiveness
 */
export interface IQuestionEffectivenessResponse {
  questions: IQuestionEffectivenessItem[];
  totalQuestions: number;
}

/**
 * 3.5 AI-HR Uyum Trend Item
 */
export interface IAIHRAlignmentTrendItem {
  period: string;       // ISO date veya period string
  overlapRatio: number; // 0-1 arası
}

/**
 * 3.5 AI – HR Uyum Analizi Response
 * GET /api/reports/ai-hr-alignment
 */
export interface IAIHRAlignmentResponse {
  overlapRatio: number;       // 0-1 arası
  aiOnlyHigh: number;         // Sadece AI'ın yüksek puan verdiği
  hrOnlyFavorite: number;     // Sadece HR'ın favorilediği
  bothHigh: number;           // İkisinin de yüksek değerlendirdiği
  totalEvaluated: number;
  alignmentTrend: IAIHRAlignmentTrendItem[];
}

/**
 * 3.6 Zaman Trendi Item
 */
export interface ITimeTrendItem {
  period: string;             // 2024-W01, 2024-01, 2024-01-15
  avgOverallScore: number;    // 0-100
  favoriteRatio: number;      // 0-1
  applicationCount: number;
  completionRate: number;     // 0-1
}

/**
 * 3.6 Zaman Trend Summary
 */
export interface ITimeTrendSummary {
  totalPeriods: number;
  avgScoreChange: number;     // Trend değişimi (pozitif/negatif)
  peakPeriod: string;
  lowestPeriod: string;
}

/**
 * 3.6 Zaman Bazlı Trendler Response
 * GET /api/reports/time-trends
 */
export interface ITimeTrendsResponse {
  trend: ITimeTrendItem[];
  interval: TrendInterval;
  summary: ITimeTrendSummary;
}

// ========================================
// UI VIEWMODEL TİPLERİ
// Backend'den bağımsız çalışabilir
// ========================================

/**
 * KPI Kart ViewModel
 * Tek bir KPI kartı için gerekli veriler
 */
export interface KPICardViewModel {
  id: string;
  label: string;
  value: number | string;
  formattedValue: string;
  change?: number;         // Önceki döneme göre % değişim
  changeType?: "increase" | "decrease" | "neutral";
  tooltip: string;
  icon?: string;
  suffix?: string;         // "%", "dk", vb.
  context?: string;        // "Son 30 gün", "Bu ay"
}

/**
 * KPI Summary Strip ViewModel
 */
export interface KPISummaryViewModel {
  cards: KPICardViewModel[];
  loading: boolean;
  error?: string;
}

/**
 * Pozisyon Analiz Chart ViewModel
 */
export interface PositionChartDataItem {
  position: string;
  positionId: string;
  department?: string;
  highFit: number;
  mediumFit: number;
  lowFit: number;
  total: number;
  // Yüzde hesaplamaları (UI'da kullanım için)
  highFitPercent: number;
  mediumFitPercent: number;
  lowFitPercent: number;
}

export interface PositionAnalysisViewModel {
  data: PositionChartDataItem[];
  loading: boolean;
  error?: string;
  // Özet istatistikler
  summary: {
    totalPositions: number;
    totalApplications: number;
    avgHighFitPercent: number;
  };
}

/**
 * Aday Dağılım Charts ViewModel
 */
export interface RoleFitHistogramItem {
  bucket: string;       // "0-20", "20-40", vb.
  count: number;
  percentage: number;
  color: string;        // UI renk kodu
}

export interface SkillScatterItem {
  id: string;           // Anonim ID
  communication: number;
  technical: number;
  problemSolving?: number;
  roleFit: number;      // Renklendirme için (0-100)
  color: string;        // Hesaplanmış renk kodu
}

export interface CandidateDistributionViewModel {
  histogram: RoleFitHistogramItem[];
  scatter: SkillScatterItem[];
  avgScores: {
    technical: number;
    communication: number;
    problemSolving: number;
    personality: number;
  };
  loading: boolean;
  error?: string;
}

/**
 * Soru Etkinlik Chart ViewModel
 */
export interface QuestionEffectivenessViewModel {
  questions: {
    questionId: string;
    questionText: string;
    shortText: string;        // Kısaltılmış metin (chart için)
    interviewTitle: string;
    discriminationIndex: number; // 0-100 (varianceScore * 100)
    avgResponseTimeSec: number;
    avgResponseTimeFormatted: string; // "2 dk 30 sn"
    completionRate: number;   // 0-100 yüzde
    avgScore: number;
    responseCount: number;
    effectiveness: "high" | "medium" | "low";
    color: string;
  }[];
  summary: {
    totalQuestions: number;
    avgDiscrimination: number;
    avgResponseTime: number;
    avgCompletion: number;
  };
  loading: boolean;
  error?: string;
}

/**
 * AI-HR Alignment Chart ViewModel
 */
export interface AIHRAlignmentViewModel {
  overallAlignment: number;  // 0-100 yüzde
  alignmentLevel: "high" | "medium" | "low";
  metrics: {
    bothHigh: number;
    aiOnlyHigh: number;
    hrOnlyFavorite: number;
    totalEvaluated: number;
  };
  trend: {
    period: string;
    date: string;           // Formatted date
    overlapPercent: number; // 0-100
  }[];
  categoryComparison: {
    category: string;
    aiScore: number;
    hrScore: number;
    difference: number;
    alignmentLevel: "aligned" | "divergent";
  }[];
  loading: boolean;
  error?: string;
}

/**
 * Time Trends Chart ViewModel
 */
export interface TrendLineData {
  period: string;
  date: string;              // Formatted display date
  avgScore: number;
  favoritePercent: number;   // 0-100
  applicationCount: number;
  completionPercent: number; // 0-100
}

export interface TimeTrendsViewModel {
  data: TrendLineData[];
  interval: TrendInterval;
  summary: {
    totalPeriods: number;
    scoreChange: number;
    scoreChangeType: "increase" | "decrease" | "neutral";
    peakPeriod: string;
    peakPeriodFormatted: string;
    lowestPeriod: string;
    lowestPeriodFormatted: string;
  };
  // Bireysel trend verileri
  trends: {
    avgScore: { current: number; previous: number; change: number };
    favoriteRate: { current: number; previous: number; change: number };
    applicationCount: { current: number; previous: number; change: number };
  };
  loading: boolean;
  error?: string;
}

// ========================================
// DATA TRANSFORMERS
// Backend Response -> ViewModel dönüşümleri
// ========================================

/**
 * ISummaryResponse -> KPISummaryViewModel
 */
export function transformSummaryToViewModel(
  response: ISummaryResponse,
  previousPeriod?: ISummaryResponse
): KPICardViewModel[] {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return undefined;
    return Math.round(((current - previous) / previous) * 100);
  };

  return [
    {
      id: "totalInterviews",
      label: "Toplam Mülakat",
      value: response.totalInterviews,
      formattedValue: response.totalInterviews.toLocaleString("tr-TR"),
      change: calculateChange(response.totalInterviews, previousPeriod?.totalInterviews),
      changeType: previousPeriod 
        ? response.totalInterviews >= previousPeriod.totalInterviews ? "increase" : "decrease"
        : undefined,
      tooltip: "Seçili dönemde oluşturulan toplam mülakat sayısı",
      context: "Son 30 gün",
    },
    {
      id: "evaluatedInterviews",
      label: "Değerlendirilen",
      value: response.evaluatedInterviews,
      formattedValue: response.evaluatedInterviews.toLocaleString("tr-TR"),
      change: calculateChange(response.evaluatedInterviews, previousPeriod?.evaluatedInterviews),
      changeType: previousPeriod 
        ? response.evaluatedInterviews >= previousPeriod.evaluatedInterviews ? "increase" : "decrease"
        : undefined,
      tooltip: "AI analizi tamamlanmış mülakat sayısı",
      context: "Analiz tamamlandı",
    },
    {
      id: "favoriteRatio",
      label: "Favori Oranı",
      value: response.favoriteRatio,
      formattedValue: `%${Math.round(response.favoriteRatio * 100)}`,
      change: calculateChange(response.favoriteRatio, previousPeriod?.favoriteRatio),
      changeType: previousPeriod 
        ? response.favoriteRatio >= previousPeriod.favoriteRatio ? "increase" : "decrease"
        : undefined,
      tooltip: "Favoriye eklenen adayların toplam adaylara oranı",
      suffix: "%",
    },
    {
      id: "avgOverallScore",
      label: "Ort. Rol Yakınlığı",
      value: response.avgOverallScore,
      formattedValue: Math.round(response.avgOverallScore).toString(),
      change: calculateChange(response.avgOverallScore, previousPeriod?.avgOverallScore),
      changeType: previousPeriod 
        ? response.avgOverallScore >= previousPeriod.avgOverallScore ? "increase" : "decrease"
        : undefined,
      tooltip: "Adayların ortalama rol yakınlık skoru (0-100)",
    },
    {
      id: "avgInterviewDuration",
      label: "Ort. Mülakat Süresi",
      value: response.avgInterviewDurationSec,
      formattedValue: `${Math.round(response.avgInterviewDurationSec / 60)} dk`,
      change: calculateChange(response.avgInterviewDurationSec, previousPeriod?.avgInterviewDurationSec),
      changeType: previousPeriod 
        ? response.avgInterviewDurationSec <= previousPeriod.avgInterviewDurationSec ? "increase" : "decrease"
        : undefined,
      tooltip: "Ortalama mülakat tamamlanma süresi",
      suffix: "dk",
    },
  ];
}

/**
 * IPositionDistributionResponse -> PositionChartDataItem[]
 */
export function transformPositionDistribution(
  response: IPositionDistributionResponse
): PositionChartDataItem[] {
  return response.positions.map((item) => {
    const total = item.distribution.highFit + item.distribution.mediumFit + item.distribution.lowFit;
    return {
      position: item.positionName,
      positionId: item.positionId,
      department: item.department,
      highFit: item.distribution.highFit,
      mediumFit: item.distribution.mediumFit,
      lowFit: item.distribution.lowFit,
      total: item.totalApplications,
      highFitPercent: total > 0 ? Math.round((item.distribution.highFit / total) * 100) : 0,
      mediumFitPercent: total > 0 ? Math.round((item.distribution.mediumFit / total) * 100) : 0,
      lowFitPercent: total > 0 ? Math.round((item.distribution.lowFit / total) * 100) : 0,
    };
  });
}

/**
 * IFitDistributionResponse -> CandidateDistributionViewModel
 */
export function transformFitDistribution(
  response: IFitDistributionResponse
): Omit<CandidateDistributionViewModel, "loading" | "error"> {
  const getHistogramColor = (range: string): string => {
    const start = parseInt(range.split("-")[0]);
    if (start >= 60) return "#22c55e"; // green
    if (start >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getScatterColor = (roleFit: number): string => {
    if (roleFit >= 70) return "#22c55e";
    if (roleFit >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return {
    histogram: response.roleFitBuckets.map((bucket) => ({
      bucket: bucket.range,
      count: bucket.count,
      percentage: bucket.percentage,
      color: getHistogramColor(bucket.range),
    })),
    scatter: response.skillScatter.map((point, index) => ({
      id: `scatter-${index}`,
      communication: point.communication,
      technical: point.technical,
      problemSolving: point.problemSolving,
      roleFit: Math.round((point.communication + point.technical + point.problemSolving) / 3),
      color: getScatterColor((point.communication + point.technical + point.problemSolving) / 3),
    })),
    avgScores: response.avgScores,
  };
}

/**
 * IQuestionEffectivenessResponse -> QuestionEffectivenessViewModel
 */
export function transformQuestionEffectiveness(
  response: IQuestionEffectivenessResponse
): Omit<QuestionEffectivenessViewModel, "loading" | "error"> {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins} dk ${secs} sn` : `${secs} sn`;
  };

  const getEffectiveness = (variance: number): "high" | "medium" | "low" => {
    if (variance >= 0.7) return "high";
    if (variance >= 0.4) return "medium";
    return "low";
  };

  const getColor = (effectiveness: "high" | "medium" | "low"): string => {
    switch (effectiveness) {
      case "high": return "#22c55e";
      case "medium": return "#f59e0b";
      case "low": return "#ef4444";
    }
  };

  const questions = response.questions.map((q) => {
    const effectiveness = getEffectiveness(q.varianceScore);
    return {
      questionId: q.questionId,
      questionText: q.questionText,
      shortText: q.questionText.length > 40 ? q.questionText.slice(0, 40) + "..." : q.questionText,
      interviewTitle: q.interviewTitle,
      discriminationIndex: Math.round(q.varianceScore * 100),
      avgResponseTimeSec: q.avgAnswerDurationSec,
      avgResponseTimeFormatted: formatTime(q.avgAnswerDurationSec),
      completionRate: Math.round(q.analysisCompletionRate * 100),
      avgScore: Math.round(q.avgScore),
      responseCount: q.responseCount,
      effectiveness,
      color: getColor(effectiveness),
    };
  });

  const avgDiscrimination = questions.length > 0
    ? Math.round(questions.reduce((sum, q) => sum + q.discriminationIndex, 0) / questions.length)
    : 0;

  const avgResponseTime = questions.length > 0
    ? Math.round(questions.reduce((sum, q) => sum + q.avgResponseTimeSec, 0) / questions.length)
    : 0;

  const avgCompletion = questions.length > 0
    ? Math.round(questions.reduce((sum, q) => sum + q.completionRate, 0) / questions.length)
    : 0;

  return {
    questions,
    summary: {
      totalQuestions: response.totalQuestions,
      avgDiscrimination,
      avgResponseTime,
      avgCompletion,
    },
  };
}

/**
 * IAIHRAlignmentResponse -> AIHRAlignmentViewModel
 */
export function transformAIHRAlignment(
  response: IAIHRAlignmentResponse
): Omit<AIHRAlignmentViewModel, "loading" | "error" | "categoryComparison"> {
  const overallPercent = Math.round(response.overlapRatio * 100);
  
  const getAlignmentLevel = (percent: number): "high" | "medium" | "low" => {
    if (percent >= 80) return "high";
    if (percent >= 60) return "medium";
    return "low";
  };

  return {
    overallAlignment: overallPercent,
    alignmentLevel: getAlignmentLevel(overallPercent),
    metrics: {
      bothHigh: response.bothHigh,
      aiOnlyHigh: response.aiOnlyHigh,
      hrOnlyFavorite: response.hrOnlyFavorite,
      totalEvaluated: response.totalEvaluated,
    },
    trend: response.alignmentTrend.map((item) => ({
      period: item.period,
      date: item.period, // Format edilebilir
      overlapPercent: Math.round(item.overlapRatio * 100),
    })),
  };
}

/**
 * ITimeTrendsResponse -> TimeTrendsViewModel
 */
export function transformTimeTrends(
  response: ITimeTrendsResponse
): Omit<TimeTrendsViewModel, "loading" | "error"> {
  const data: TrendLineData[] = response.trend.map((item) => ({
    period: item.period,
    date: item.period, // Format edilebilir
    avgScore: Math.round(item.avgOverallScore),
    favoritePercent: Math.round(item.favoriteRatio * 100),
    applicationCount: item.applicationCount,
    completionPercent: Math.round(item.completionRate * 100),
  }));

  const getChangeType = (change: number): "increase" | "decrease" | "neutral" => {
    if (change > 0) return "increase";
    if (change < 0) return "decrease";
    return "neutral";
  };

  // Son ve ilk dönem karşılaştırması
  const firstPeriod = data[0];
  const lastPeriod = data[data.length - 1];

  return {
    data,
    interval: response.interval,
    summary: {
      totalPeriods: response.summary.totalPeriods,
      scoreChange: response.summary.avgScoreChange,
      scoreChangeType: getChangeType(response.summary.avgScoreChange),
      peakPeriod: response.summary.peakPeriod,
      peakPeriodFormatted: response.summary.peakPeriod,
      lowestPeriod: response.summary.lowestPeriod,
      lowestPeriodFormatted: response.summary.lowestPeriod,
    },
    trends: {
      avgScore: {
        current: lastPeriod?.avgScore || 0,
        previous: firstPeriod?.avgScore || 0,
        change: lastPeriod && firstPeriod ? lastPeriod.avgScore - firstPeriod.avgScore : 0,
      },
      favoriteRate: {
        current: lastPeriod?.favoritePercent || 0,
        previous: firstPeriod?.favoritePercent || 0,
        change: lastPeriod && firstPeriod ? lastPeriod.favoritePercent - firstPeriod.favoritePercent : 0,
      },
      applicationCount: {
        current: lastPeriod?.applicationCount || 0,
        previous: firstPeriod?.applicationCount || 0,
        change: lastPeriod && firstPeriod ? lastPeriod.applicationCount - firstPeriod.applicationCount : 0,
      },
    },
  };
}

// ========================================
// FİLTRE & DROPDOWN SEÇENEKLERİ
// ========================================

/**
 * Pozisyon listesi (filtre dropdown için)
 */
export interface PositionOption {
  id: string;
  name: string;
  department?: string;
  applicationCount?: number;
}

/**
 * Reviewer listesi (filtre dropdown için)
 */
export interface ReviewerOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Mülakat listesi (filtre dropdown için)
 */
export interface InterviewOption {
  id: string;
  title: string;
  positionName?: string;
  status: string;
}

// ========================================
// CHART COLOR PALETTES
// ========================================

export const CHART_COLORS = {
  // Fit level colors
  highFit: "#22c55e",    // Green
  mediumFit: "#f59e0b",  // Yellow/Amber
  lowFit: "#ef4444",     // Red
  
  // Trend line colors
  primary: "#3b82f6",    // Blue
  secondary: "#a855f7",  // Purple
  tertiary: "#06b6d4",   // Cyan
  
  // Neutral
  muted: "#94a3b8",
  border: "#e2e8f0",
} as const;

// ========================================
// EXPORT LEGACY TYPES (Geriye uyumluluk)
// ========================================

// Eski tipler için alias'lar - mevcut bileşenlerin çalışması için
export type ReportFilters = ReportFiltersState;
export type KPISummaryData = {
  totalApplications: number;
  totalApplicationsChange?: number;
  evaluatedInterviews: number;
  evaluatedInterviewsChange?: number;
  favoritesRate: number;
  favoritesRateChange?: number;
  averageRoleFit: number;
  averageRoleFitChange?: number;
  averageInterviewDuration: number;
  averageInterviewDurationChange?: number;
};

export type PositionAnalysisData = PositionChartDataItem;

export type CandidateDistributionData = {
  roleFitDistribution: RoleFitHistogramItem[];
  communicationVsTechnical: SkillScatterItem[];
};

export type QuestionEffectivenessData = QuestionEffectivenessViewModel["questions"][number];

export type AIHRAlignmentData = AIHRAlignmentViewModel & {
  categoryAlignments: AIHRAlignmentViewModel["categoryComparison"];
};

export type TrendDataPoint = {
  date: string;
  value: number;
};

export type TimeTrendsData = {
  applicationQualityTrend: TrendDataPoint[];
  averageFitTrend: TrendDataPoint[];
  favoritesRateTrend: TrendDataPoint[];
  applicationCountTrend?: TrendDataPoint[];
};
