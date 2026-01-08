// src/services/applicationService.ts

import api from '@/utils/api';
import { 
    Application, 
    ApplicationQueryParams, 
    PaginatedApplicationResponse 
} from '@/types/application';

/**
 * Ana başvuru çekme fonksiyonu - Server-side filter/pagination destekli
 * 
 * @param params - Query parametreleri
 * @returns PaginatedApplicationResponse - Sayfalanmış başvuru listesi
 * 
 * Backend endpoint: GET /applications
 * Query params: page, limit, interviewId?, status?, query?, aiScoreMin?, sortBy?, sortOrder?
 */
export const getApplications = async (
    params: ApplicationQueryParams = {}
): Promise<PaginatedApplicationResponse> => {
    try {
        const queryParams = new URLSearchParams();
        
        // Sayfalama parametreleri (varsayılan değerler)
        queryParams.append('page', String(params.page ?? 1));
        queryParams.append('limit', String(params.limit ?? 10));
        
        // Filtre parametreleri
        if (params.interviewId) {
            queryParams.append('interviewId', params.interviewId);
        }
        if (params.status && params.status !== 'all') {
            queryParams.append('status', params.status);
        }

        // ✅ EKLENDİ: Backend'deki AI Analiz Durumu Filtresi
        // Bu sayede "Tamamlananlar" ve "Bekleyenler" sekmeleri çalışacak
        if (params.analysisStatus && params.analysisStatus !== 'all') {
            queryParams.append('analysisStatus', params.analysisStatus);
        }

        if (params.query && params.query.trim() !== '') {
            queryParams.append('query', params.query.trim());
        }
        if (params.aiScoreMin !== undefined && params.aiScoreMin > 0) {
            queryParams.append('aiScoreMin', String(params.aiScoreMin));
        }
        
        // Sıralama parametreleri
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }
        if (params.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }

        const response = await api.get<PaginatedApplicationResponse>(
            `/applications?${queryParams.toString()}`
        );
        
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

/**
 * Belirli bir Mülakat ID'sine ait başvuruları getirir.
 * Mülakat detay sayfası için optimize edilmiş versiyon.
 * 
 * @param interviewId - Mülakat ID'si
 * @returns Application[] - Başvuru listesi
 */
export const getApplicationsByInterviewId = async (
    interviewId: string
): Promise<PaginatedApplicationResponse> => {
    try {
        const response = await getApplications({
            interviewId,
            page: 1,
            limit: 100 // Mülakat başına tüm başvuruları getir
        });
        return response;
    } catch (error) {
        console.error(`Error fetching applications for interview ${interviewId}:`, error);
        throw error;
    }
};

/**
 * Tek bir başvuruyu ID ile getiren fonksiyon.
 */
export const getApplicationById = async (id: string): Promise<Application> => {
    try {
        const response = await api.get<{ success: boolean; data: Application }>(
            `/applications/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching application by id:', error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: Başvurunun durumunu günceller (Kabul/Red/Beklemede).
 * @param id Başvurunun ID'si
 * @param newStatus Yeni durum ('pending', 'rejected', 'accepted')
 */
export const updateApplicationStatus = async (
    id: string,
    newStatus: 'pending' | 'rejected' | 'accepted'
): Promise<Application> => {
    try {
        const response = await api.patch<{ success: boolean; data: Application }>(
            // Backend'deki rota: PATCH /applications/:id/status
            `/applications/${id}/status`, 
            { status: newStatus } // Backend DTO'suna uygun olarak gönderiliyor
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error updating application status for ${id}:`, error);
        throw error;
    }
};