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
 * ✅ YENİ METOT: Başvurunun durumunu günceller (Kabul/Red/Beklemede/Arşiv).
 * @param id Başvurunun ID'si
 * @param newStatus Yeni durum ('pending', 'rejected', 'accepted', 'completed', 'archived')
 */
export const updateApplicationStatus = async (
    id: string,
    newStatus: 'pending' | 'rejected' | 'accepted' | 'completed' | 'archived'
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

/**
 * ✅ YENİ METOT: HR Notu Ekle
 * POST /applications/:id/notes
 */
export const addHRNote = async (
    applicationId: string,
    content: string,
    isPrivate: boolean = false
): Promise<Application> => {
    try {
        const response = await api.post<{ success: boolean; data: Application }>(
            `/applications/${applicationId}/notes`,
            { content, isPrivate }
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error adding HR note for ${applicationId}:`, error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: HR Notu Güncelle
 * PATCH /applications/:id/notes/:noteId
 */
export const updateHRNote = async (
    applicationId: string,
    noteId: string,
    updates: { content?: string; isPrivate?: boolean }
): Promise<Application> => {
    try {
        const response = await api.patch<{ success: boolean; data: Application }>(
            `/applications/${applicationId}/notes/${noteId}`,
            updates
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error updating HR note ${noteId}:`, error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: HR Notu Sil
 * DELETE /applications/:id/notes/:noteId
 */
export const deleteHRNote = async (
    applicationId: string,
    noteId: string
): Promise<Application> => {
    try {
        const response = await api.delete<{ success: boolean; data: Application }>(
            `/applications/${applicationId}/notes/${noteId}`
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error deleting HR note ${noteId}:`, error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: HR Rating Güncelle
 * PATCH /applications/:id/rating
 */
export const updateHRRating = async (
    applicationId: string,
    rating: number
): Promise<Application> => {
    try {
        const response = await api.patch<{ success: boolean; data: Application }>(
            `/applications/${applicationId}/rating`,
            { rating }
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error updating HR rating for ${applicationId}:`, error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: Toggle Favorite (Add/Remove)
 */
export const toggleFavorite = async (
    applicationId: string,
    action: 'add' | 'remove'
): Promise<Application> => {
    try {
        const method = action === 'add' ? 'post' : 'delete';
        const response = await api[method]<{ success: boolean; data: Application }>(
            `/applications/${applicationId}/favorite`
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error toggling favorite for ${applicationId}:`, error);
        throw error;
    }
};
