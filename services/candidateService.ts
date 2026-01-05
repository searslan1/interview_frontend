// src/services/candidateService.ts

import api from "@/utils/api";
import type { 
  Candidate, 
  CandidateFilters, 
  CandidateSortBy, 
  CandidateSortOrder,
  CandidateNote,
  CandidateStatus,
  CandidateListResponse,
  PositionOption // Types dosyasında tanımladığımız response tipi
} from "@/types/candidate";

// ========== RESPONSE TYPES ==========

// Frontend store'un beklediği format (adapter pattern)
interface PaginatedCandidatesResponse {
  success: boolean;
  data: Candidate[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

interface SingleCandidateResponse {
  success: boolean;
  data: Candidate;
}

// ========== SERVICE FUNCTIONS ==========

/**
 * Tüm adayları filtreli ve sayfalı olarak getir
 * GET /api/candidates
 */
export const getCandidates = async (
  filters: Partial<CandidateFilters> = {},
  page: number = 1,
  limit: number = 20,
  sortBy: CandidateSortBy = "lastInterview",
  sortOrder: CandidateSortOrder = "desc"
): Promise<PaginatedCandidatesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString()); // Backend 'limit' veya 'pageSize' kabul ediyor
    
    // Sorting
    queryParams.append("sortBy", sortBy); // Backend: 'lastInterview', 'score', 'createdAt', 'name'
    queryParams.append("sortOrder", sortOrder);
    
    // --- PARAMETRE MAPPING (Frontend -> Backend) ---
    
    // Arama
    if (filters.search) {
      queryParams.append("search", filters.search);
    }
    
    // Durum (Backend array veya comma-separated string kabul eder)
    if (filters.status && filters.status.length > 0) {
      const statusValue = Array.isArray(filters.status) ? filters.status.join(',') : filters.status;
      if (statusValue !== 'all') { // 'all' kontrolü UI'dan gelebilir
          queryParams.append("status", statusValue);
      }
    }
    
    // ID Filtreleri
    if (filters.positionIds && filters.positionIds.length > 0) {
        queryParams.append("positionIds", filters.positionIds.join(','));
    }
    if (filters.interviewIds && filters.interviewIds.length > 0) {
        queryParams.append("interviewIds", filters.interviewIds.join(','));
    }

    // Skorlar (Mapping düzeltildi)
    if (filters.minOverallScore !== undefined) queryParams.append("minOverallScore", filters.minOverallScore.toString());
    if (filters.maxOverallScore !== undefined) queryParams.append("maxOverallScore", filters.maxOverallScore.toString());
    if (filters.minTechnicalScore !== undefined) queryParams.append("minTechnicalScore", filters.minTechnicalScore.toString());
    
    // Mülakat Sayısı
    if (filters.minInterviewCount !== undefined) queryParams.append("minInterviewCount", filters.minInterviewCount.toString());
    
    // Tarih Aralığı (Mapping düzeltildi: dateFrom -> lastInterviewAfter)
    if (filters.lastInterviewAfter) {
      const dateVal = filters.lastInterviewAfter instanceof Date ? filters.lastInterviewAfter.toISOString() : filters.lastInterviewAfter;
      queryParams.append("lastInterviewAfter", dateVal);
    }
    if (filters.lastInterviewBefore) {
      const dateVal = filters.lastInterviewBefore instanceof Date ? filters.lastInterviewBefore.toISOString() : filters.lastInterviewBefore;
      queryParams.append("lastInterviewBefore", dateVal);
    }
    
    // Boolean Filtreler
    if (filters.onlyFavorites) {
      queryParams.append("onlyFavorites", "true");
    }

    // API Çağrısı
    const response = await api.get<CandidateListResponse>(
      `/candidates?${queryParams.toString()}`
    );

    // Backend zaten bizim istediğimiz formatta dönüyor (CandidateListResponse)
    const { data, pagination } = response.data;
    
    return {
      success: true,
      data, // Candidate[]
      meta: {
        total: pagination.totalCount,
        page: pagination.page,
        limit: pagination.pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

/**
 * Tek bir adayı ID ile getir (detay sayfası için)
 * GET /api/candidates/:id
 */
export const getCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const response = await api.get<SingleCandidateResponse>(`/candidates/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching candidate ${id}:`, error);
    throw error; // Component seviyesinde catch edilecek (410 Gone / Merge redirect için)
  }
};

/**
 * Adayın mülakat geçmişini getir
 * GET /api/candidates/:id/interviews
 */
export const getCandidateInterviews = async (candidateId: string) => {
  try {
    const response = await api.get<{ success: boolean, data: any[] }>(`/candidates/${candidateId}/interviews`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching interviews for candidate ${candidateId}:`, error);
    throw error;
  }
};

/**
 * Aday durumunu güncelle
 * PATCH /api/candidates/:id/status
 */
export const updateCandidateStatus = async (
  id: string, 
  status: CandidateStatus
): Promise<boolean> => {
  try {
    const response = await api.patch<{ success: boolean, message: string }>(
      `/candidates/${id}/status`,
      { status }
    );
    return response.data.success;
  } catch (error) {
    console.error(`Error updating candidate status ${id}:`, error);
    throw error;
  }
};

/**
 * Adaya not ekle
 * POST /api/candidates/:id/notes
 */
export const addCandidateNote = async (
  candidateId: string,
  content: string
): Promise<CandidateNote> => {
  try {
    const response = await api.post<{ success: boolean; data: CandidateNote }>(
      `/candidates/${candidateId}/notes`,
      { content }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error adding note to candidate ${candidateId}:`, error);
    throw error;
  }
};

// ⚠️ NOT: updateCandidateNote ve deleteCandidateNote backend'de henüz yok.
// İhtiyaç olursa backend controller ve route'a eklenmeli.

/**
 * Olası aday eşleşmelerini getir (Duplicate Detection)
 * GET /api/candidates/:id/potential-duplicates
 */
export const getPotentialDuplicates = async (candidateId: string) => {
  try {
    // ✅ Endpoint düzeltildi (backend: potential-duplicates)
    const response = await api.get<{ success: boolean, data: any[] }>(
        `/candidates/${candidateId}/potential-duplicates`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching potential duplicates for ${candidateId}:`, error);
    throw error;
  }
};

/**
 * İki adayı birleştir (merge)
 * POST /api/candidates/:id/merge
 */
export const mergeCandidates = async (
  primaryCandidateId: string, // Hedef (Yaşayacak olan)
  secondaryCandidateId: string // Kaynak (Arşivlenecek olan)
): Promise<any> => {
  try {
    // ✅ Endpoint ve Payload düzeltildi
    // Kaynak ID URL'de, Hedef ID Body'de
    const response = await api.post<SingleCandidateResponse>(
      `/candidates/${secondaryCandidateId}/merge`,
      { targetCandidateId: primaryCandidateId }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error merging candidates:", error);
    throw error;
  }
};

/**
 * Adayları favorilerden çek (HR kullanıcısına özel)
 * Backend'de ayrı endpoint yok, listCandidates filtresi var.
 */
export const getFavoriteCandidates = async (): Promise<Candidate[]> => {
  try {
    // ✅ Logic düzeltildi: getCandidates'i reuse ediyoruz
    const response = await getCandidates({ onlyFavorites: true }, 1, 100);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite candidates:", error);
    throw error;
  }
};

/**
 * Adayı favorilere ekle
 * POST /api/candidates/:id/favorite
 */
export const addToFavorites = async (candidateId: string): Promise<void> => {
  try {
    await api.post(`/candidates/${candidateId}/favorite`);
  } catch (error) {
    console.error(`Error adding candidate ${candidateId} to favorites:`, error);
    throw error;
  }
};

/**
 * Adayı favorilerden çıkar
 * DELETE /api/candidates/:id/favorite
 */
export const removeFromFavorites = async (candidateId: string): Promise<void> => {
  try {
    await api.delete(`/candidates/${candidateId}/favorite`);
  } catch (error) {
    console.error(`Error removing candidate ${candidateId} from favorites:`, error);
    throw error;
  }
};

/**
 * Pozisyon listesini getir (filtre için)
 * GET /api/candidates/positions
 */
export const getAvailablePositions = async (): Promise<PositionOption[]> => {
  try {
    // ✅ DÜZELTİLDİ: Tip dönüşümü PositionOption[] olarak sağlandı
    const response = await api.get<{ success: boolean; data: PositionOption[] }>(
      `/candidates/positions`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching available positions:", error);
    throw error;
  }
};

const candidateService = {
  getCandidates,
  getCandidateById,
  getCandidateInterviews,
  updateCandidateStatus,
  addCandidateNote,
  getPotentialDuplicates,
  mergeCandidates,
  getFavoriteCandidates,
  addToFavorites,
  removeFromFavorites,
  getAvailablePositions,
};

export default candidateService;