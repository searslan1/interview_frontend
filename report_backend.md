// src/modules/reports/types/reports.types.ts

/**
 * Reports Modülü Tip Tanımları
 * 
 * Tüm reports endpoint'leri için ortak tipler.
 * Candidate-level veri expose edilmez, sadece aggregate istatistikler.
 */

// ================================
// ORTAK FİLTRE PARAMETRELERİ
// ================================

/**
 * Tüm report endpoint'lerinde kullanılan ortak filtre parametreleri.
 * Frontend tek tip filtre seti kullanır.
 */
export interface IReportFilters {
    /** Pozisyon ID'leri (virgülle ayrılmış) */
    positionIds?: string[];
    
    /** Mülakat ID'leri */
    interviewIds?: string[];
    
    /** Başlangıç tarihi (ISO format) */
    startDate?: Date;
    
    /** Bitiş tarihi (ISO format) */
    endDate?: Date;
    
    /** HR reviewer ID'leri */
    reviewerIds?: string[];
    
    /** Etiketler (strong, medium, weak) */
    tags?: string[];
    
    /** Sadece favoriler */
    onlyFavorites?: boolean;
    
    /** Durum filtresi */
    status?: string[];
}

/**
 * Parsed query parametreleri
 */
export interface IParsedReportQuery {
    filters: IReportFilters;
    interval?: 'daily' | 'weekly' | 'monthly';
}

// ================================
// RESPONSE TİPLERİ
// ================================

/**
 * 3.1 Özet KPI Şeridi Response
 * GET /reports/summary
 */
export interface ISummaryResponse {
    totalInterviews: number;
    evaluatedInterviews: number;
    pendingInterviews: number;
    completedApplications: number;
    favoriteRatio: number;
    avgOverallScore: number;
    avgTechnicalScore: number;
    avgCommunicationScore: number;
    avgInterviewDurationSec: number;
}

/**
 * 3.2 Pozisyon Bazlı Dağılım Response
 * GET /reports/position-distribution
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

export interface IPositionDistributionResponse {
    positions: IPositionDistributionItem[];
}

/**
 * 3.3 Rol Yakınlığı & Yetkinlik Dağılımı Response
 * GET /reports/fit-distribution
 */
export interface IFitBucket {
    range: string;
    count: number;
    percentage: number;
}

export interface ISkillScatterPoint {
    communication: number;
    technical: number;
    problemSolving: number;
}

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
 * 3.4 Soru Bazlı Ayırt Edicilik Raporu Response
 * GET /reports/question-effectiveness
 */
export interface IQuestionEffectivenessItem {
    questionId: string;
    questionText: string;
    interviewTitle: string;
    varianceScore: number;          // Adayları ayırma gücü (0-1)
    avgAnswerDurationSec: number;
    analysisCompletionRate: number; // Tamamlanma oranı (0-1)
    avgScore: number;
    responseCount: number;
}

export interface IQuestionEffectivenessResponse {
    questions: IQuestionEffectivenessItem[];
    totalQuestions: number;
}

/**
 * 3.5 AI – HR Uyum Analizi Response
 * GET /reports/ai-hr-alignment
 */
export interface IAIHRAlignmentResponse {
    overlapRatio: number;       // AI ve HR'ın aynı fikirde olduğu oran
    aiOnlyHigh: number;         // Sadece AI'ın yüksek puan verdiği
    hrOnlyFavorite: number;     // Sadece HR'ın favorilediği
    bothHigh: number;           // İkisinin de yüksek değerlendirdiği
    totalEvaluated: number;
    alignmentTrend: {
        period: string;
        overlapRatio: number;
    }[];
}

/**
 * 3.6 Zaman Bazlı Trendler Response
 * GET /reports/time-trends
 */
export interface ITimeTrendItem {
    period: string;             // 2024-W01, 2024-01, 2024-01-15
    avgOverallScore: number;
    favoriteRatio: number;
    applicationCount: number;
    completionRate: number;
}

export interface ITimeTrendsResponse {
    trend: ITimeTrendItem[];
    interval: 'daily' | 'weekly' | 'monthly';
    summary: {
        totalPeriods: number;
        avgScoreChange: number;     // Trend değişimi
        peakPeriod: string;
        lowestPeriod: string;
    };
}

// ================================
// INTERNAL TİPLER (Servis içi)
// ================================

/**
 * Aggregation pipeline sonuçları için internal tipler
 */
export interface IAggregatedScore {
    _id: any;
    avgOverallScore: number;
    avgTechnicalScore: number;
    avgCommunicationScore: number;
    avgProblemSolvingScore: number;
    count: number;
}

export interface IStatusCount {
    _id: string;
    count: number;
}

/**
 * Cache key builder için
 */
export interface ICacheKeyParams {
    endpoint: string;
    filters: IReportFilters;
    interval?: string;
}

// src/modules/reports/routes/reports.routes.ts

import { Router } from 'express';
import ReportsController from '../controllers/reports.controller';
import { authenticate } from '../../../middlewares/auth';
import { cacheMiddleware } from '../middlewares/cache.middleware';

const router = Router();

/**
 * Reports Routes
 * 
 * Tüm endpoint'ler:
 * - HR role required (authenticate + authorize)
 * - Read-only (sadece GET)
 * - Ortak filtre parametreleri destekler
 * - Cache-friendly headers döner
 * 
 * Ortak Query Parametreleri:
 * - positionIds: Pozisyon ID'leri (virgülle ayrılmış)
 * - interviewIds: Mülakat ID'leri (virgülle ayrılmış)
 * - startDate: Başlangıç tarihi (ISO format: 2024-01-01)
 * - endDate: Bitiş tarihi (ISO format: 2024-03-31)
 * - reviewerIds: HR reviewer ID'leri (virgülle ayrılmış)
 * - tags: Etiketler (strong,medium,weak)
 * - onlyFavorites: Sadece favoriler (true/false)
 * - status: Durum filtresi (pending,completed,accepted)
 */

/**
 * @route   GET /api/reports/summary
 * @desc    Özet KPI Şeridi - Genel metrikler
 * @access  Private (HR)
 * @cache   5 dakika
 * 
 * Response:
 * {
 *   totalInterviews, evaluatedInterviews, pendingInterviews,
 *   completedApplications, favoriteRatio, avgOverallScore,
 *   avgTechnicalScore, avgCommunicationScore, avgInterviewDurationSec
 * }
 */
router.get('/summary', authenticate, cacheMiddleware(300), ReportsController.getSummary);

/**
 * @route   GET /api/reports/position-distribution
 * @desc    Pozisyon Bazlı Aday Dağılımı
 * @access  Private (HR)
 * @cache   10 dakika
 * 
 * Response:
 * {
 *   positions: [{
 *     positionId, positionName, department,
 *     distribution: { highFit, mediumFit, lowFit },
 *     totalApplications
 *   }]
 * }
 */
router.get('/position-distribution', authenticate, cacheMiddleware(600), ReportsController.getPositionDistribution);

/**
 * @route   GET /api/reports/fit-distribution
 * @desc    Rol Yakınlığı & Yetkinlik Dağılımı
 * @access  Private (HR)
 * @cache   10 dakika
 * 
 * Response:
 * {
 *   roleFitBuckets: [{ range, count, percentage }],
 *   avgScores: { technical, communication, problemSolving, personality },
 *   skillScatter: [{ communication, technical, problemSolving }]
 * }
 */
router.get('/fit-distribution', authenticate, cacheMiddleware(600), ReportsController.getFitDistribution);

/**
 * @route   GET /api/reports/question-effectiveness
 * @desc    Soru Bazlı Ayırt Edicilik Raporu
 * @access  Private (HR)
 * @cache   15 dakika
 * 
 * Response:
 * {
 *   questions: [{
 *     questionId, questionText, interviewTitle,
 *     varianceScore, avgAnswerDurationSec, analysisCompletionRate,
 *     avgScore, responseCount
 *   }],
 *   totalQuestions
 * }
 */
router.get('/question-effectiveness', authenticate, cacheMiddleware(900), ReportsController.getQuestionEffectiveness);

/**
 * @route   GET /api/reports/ai-hr-alignment
 * @desc    AI – HR Uyum Analizi
 * @access  Private (HR)
 * @cache   10 dakika
 * 
 * Response:
 * {
 *   overlapRatio, aiOnlyHigh, hrOnlyFavorite, bothHigh,
 *   totalEvaluated, alignmentTrend: [{ period, overlapRatio }]
 * }
 */
router.get('/ai-hr-alignment', authenticate, cacheMiddleware(600), ReportsController.getAIHRAlignment);

/**
 * @route   GET /api/reports/time-trends
 * @desc    Zaman Bazlı Trendler
 * @access  Private (HR)
 * @cache   30 dakika
 * 
 * Additional Query Params:
 * - interval: daily | weekly | monthly (default: weekly)
 * 
 * Response:
 * {
 *   trend: [{
 *     period, avgOverallScore, favoriteRatio,
 *     applicationCount, completionRate
 *   }],
 *   interval,
 *   summary: { totalPeriods, avgScoreChange, peakPeriod, lowestPeriod }
 * }
 */
router.get('/time-trends', authenticate, cacheMiddleware(1800), ReportsController.getTimeTrends);

export default router;

GET /api/reports/summary	Özet KPI'lar	5 dk
GET /api/reports/position-distribution	Pozisyon bazlı dağılım	10 dk
GET /api/reports/fit-distribution	Skor dağılımı & scatter	10 dk
GET /api/reports/question-effectiveness	Soru ayırt ediciliği	15 dk
GET /api/reports/ai-hr-alignment	AI-HR uyum analizi	10 dk
GET /api/reports/time-trends	Zaman bazlı trendler	30 dk