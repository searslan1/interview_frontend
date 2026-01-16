// src/services/candidateService.ts

import api from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
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

// Auth store'dan currentUserId'yi al (service tarafında)
const getCurrentUserId = (): string | undefined => {
  return useAuthStore.getState().user?._id;
};

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
 * ⚠️ Application'ları Candidate formatına dönüştür
 * Backend'de aday bilgileri application.candidate içinde tutuluyor
 * 
 * @param applications - Backend'den gelen Application array
 * @param currentUserId - Mevcut kullanıcı ID (favorite kontrolü için)
 */
const adaptApplicationsToCandidates = (applications: any[], currentUserId?: string): Candidate[] => {
  return applications.map((app) => {
    // Backend Application model yapısı:
    // - candidate: { name, surname, email, phone, phoneVerified }
    // - education: [{ school, degree, graduationYear }]
    // - experience: [{ company, position, duration, responsibilities }]
    // - skills: { technical: [], personal: [], languages: [] }
    // - hrNotes: [{ authorId, authorName, content, createdAt, isPrivate }]
    // - hrRating: number (1-5)
    // - favoritedBy: ObjectId[] (İK kullanıcı ID'leri)
    
    const candidateInfo = app.candidate || {};
    const aiAnalysis = app.aiAnalysisResults?.[0] || app.latestAIAnalysisId || {};
    
    // Favorite kontrolü: currentUserId favoritedBy array'inde var mı?
    const isFavorite = currentUserId 
      ? (app.favoritedBy || []).some((id: any) => id.toString() === currentUserId.toString())
      : false;

    return {
      _id: app._id,
      id: app._id,
      name: candidateInfo.name || '',
      surname: candidateInfo.surname || '',
      fullName: `${candidateInfo.name || ''} ${candidateInfo.surname || ''}`.trim(),
      primaryEmail: candidateInfo.email || '',
      email: candidateInfo.email, // Geriye uyumluluk için
      phone: candidateInfo.phone || '',
      
      // Status mapping
      status: mapApplicationStatusToCandidateStatus(app.status),
      
      // Favorite
      isFavorite,
      favoritedAt: isFavorite ? app.updatedAt : undefined,
      
      // Score Summary - Backend'den AI analiz sonuçları
      scoreSummary: {
        avgOverallScore: aiAnalysis.overallScore || 0,
        avgTechnicalScore: aiAnalysis.technicalSkillsScore || 0,
        avgCommunicationScore: aiAnalysis.communicationScore || 0,
        avgProblemSolvingScore: aiAnalysis.problemSolvingScore || 0,
        lastScore: aiAnalysis.overallScore || 0,
        lastScoreDate: app.completedAt || app.updatedAt,
        totalInterviews: 1, // Bir application = bir interview
        completedInterviews: app.status === 'completed' || app.status === 'accepted' || app.status === 'rejected' ? 1 : 0,
      },
      
      // CV Data - Backend'den direkt alınıyor
      experience: app.experience || [],
      education: app.education || [],
      skills: app.skills?.technical || app.skills || [], // String array bekleniyor
      
      // Interview Dates
      lastInterviewDate: app.updatedAt || app.createdAt,
      firstInterviewDate: app.createdAt,
      lastInterviewTitle: app.interviewId?.title || 'Mülakat',
      
      // Notes - Backend hrNotes array'i
      notes: (app.hrNotes || []).map((note: any) => ({
        _id: note._id,
        authorId: note.authorId,
        authorName: note.authorName,
        content: note.content,
        createdAt: note.createdAt,
      })),
      notesCount: (app.hrNotes || []).length,
      
      // Timestamps
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    };
  });
};

/**
 * Application status'u Candidate status'e map et
 */
const mapApplicationStatusToCandidateStatus = (appStatus: string): CandidateStatus => {
  const statusMap: Record<string, CandidateStatus> = {
    'pending': 'active',
    'otp_verified': 'active',
    'awaiting_video_responses': 'active',
    'in_progress': 'active',
    'awaiting_ai_analysis': 'active',
    'completed': 'active',
    'accepted': 'hired',
    'rejected': 'rejected',
  };
  return statusMap[appStatus] || 'active';
};

/**
 * Tüm adayları filtreli ve sayfalı olarak getir
 * GET /api/candidates (GEÇİCİ: /api/applications kullanıyor)
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

    // Backend'den applications çek (adaylar başvuruların içinde)
    const response = await api.get<any>(
      `/applications?${queryParams.toString()}`
    );

    // Backend response formatı: { success, data: Application[], meta: { total, page, limit } }
    const applicationsData = response.data.data || response.data;
    const metaData = response.data.meta || { total: 0, page: 1, limit: 10 };
    
    // Applications'ı Candidates formatına dönüştür
    // currentUserId favori kontrolü için gerekli
    const currentUserId = getCurrentUserId();
    const candidates = adaptApplicationsToCandidates(applicationsData, currentUserId);
    
    return {
      success: true,
      data: candidates,
      meta: {
        total: metaData.total,
        page: metaData.page,
        limit: metaData.limit,
      },
    };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

/**
 * Tek bir adayı ID ile getir (detay sayfası için)
 * GET /api/applications/:id (GEÇİCİ: /applications kullanıyor)
 */
export const getCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const response = await api.get<{ success: boolean; data: any }>(`/applications/${id}`);
    const app = response.data.data;
    
    // Application'ı Candidate formatına dönüştür
    // currentUserId favori kontrolü için gerekli
    const currentUserId = getCurrentUserId();
    const candidates = adaptApplicationsToCandidates([app], currentUserId);
    return candidates[0];
  } catch (error) {
    console.error(`Error fetching candidate ${id}:`, error);
    throw error;
  }
};

/**
 * Adayın mülakat geçmişini getir
 * GET /api/applications/:id (GEÇİCİ: Tek application döner, array'e çeviriyoruz)
 */
export const getCandidateInterviews = async (candidateId: string) => {
  try {
    const response = await api.get<{ success: boolean, data: any }>(`/applications/${candidateId}`);
    // Tek application'ı array'e çevir
    return [response.data.data];
  } catch (error) {
    console.error(`Error fetching interviews for candidate ${candidateId}:`, error);
    throw error;
  }
};

/**
 * Aday durumunu güncelle
 * PATCH /api/applications/:id/status
 */
export const updateCandidateStatus = async (
  id: string, 
  status: CandidateStatus
): Promise<boolean> => {
  try {
    // Candidate status'u Application status'e map et
    const appStatus = status === 'hired' ? 'accepted' : status === 'rejected' ? 'rejected' : 'completed';
    
    const response = await api.patch<{ success: boolean, message: string }>(
      `/applications/${id}/status`,
      { status: appStatus }
    );
    return response.data.success;
  } catch (error) {
    console.error(`Error updating candidate status ${id}:`, error);
    throw error;
  }
};

/**
 * Adaya not ekle
 * POST /api/applications/:id/notes
 */
export const addCandidateNote = async (
  candidateId: string,
  content: string
): Promise<CandidateNote> => {
  try {
    const response = await api.post<{ success: boolean; data: any }>(
      `/applications/${candidateId}/notes`,
      { content, isPrivate: false }
    );
    
    // Son eklenen notu döndür
    const app = response.data.data;
    const lastNote = app.hrNotes?.[app.hrNotes.length - 1];
    
    return {
      _id: lastNote?._id || '',
      content: lastNote?.content || content,
      createdAt: lastNote?.createdAt || new Date().toISOString(),
      createdBy: lastNote?.authorName || 'HR User',
    };
  } catch (error) {
    console.error(`Error adding note to candidate ${candidateId}:`, error);
    throw error;
  }
};

// ⚠️ NOT: updateCandidateNote ve deleteCandidateNote backend'de henüz yok.
// İhtiyaç olursa backend controller ve route'a eklenmeli.

/**
 * Olası aday eşleşmelerini getir (Duplicate Detection)
 * ⚠️ GEÇİCİ: Backend'de bu özellik yok, boş array dön
 */
export const getPotentialDuplicates = async (candidateId: string) => {
  try {
    // TODO: Backend'de duplicate detection implement edilince açılacak
    return [];
  } catch (error) {
    console.error(`Error fetching potential duplicates for ${candidateId}:`, error);
    return [];
  }
};

/**
 * İki adayı birleştir (merge)
 * ⚠️ GEÇİCİ: Backend'de bu özellik yok
 */
export const mergeCandidates = async (
  primaryCandidateId: string,
  secondaryCandidateId: string
): Promise<any> => {
  try {
    // TODO: Backend'de merge functionality implement edilince açılacak
    throw new Error('Merge functionality not yet implemented in backend');
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
 * POST /api/applications/:id/favorite
 */
export const addToFavorites = async (candidateId: string): Promise<void> => {
  try {
    await api.post(`/applications/${candidateId}/favorite`);
  } catch (error) {
    console.error(`Error adding candidate ${candidateId} to favorites:`, error);
    throw error;
  }
};

/**
 * Adayı favorilerden çıkar
 * DELETE /api/applications/:id/favorite
 */
export const removeFromFavorites = async (candidateId: string): Promise<void> => {
  try {
    await api.delete(`/applications/${candidateId}/favorite`);
  } catch (error) {
    console.error(`Error removing candidate ${candidateId} from favorites:`, error);
    throw error;
  }
};

/**
 * Pozisyon listesini getir (filtre için)
 * GET /api/v1/interviews (mülakatlardan pozisyonları çıkar)
 */
export const getAvailablePositions = async (): Promise<PositionOption[]> => {
  try {
    // Mülakatlardan pozisyonları çıkaralım
    const response = await api.get<{ success: boolean; data: any[] }>(`/interviews/my`);
    const interviews = response.data.data || [];
    
    // Unique pozisyonlar
    const positionsMap = new Map<string, PositionOption>();
    
    interviews.forEach((interview: any) => {
      const positionTitle = interview.position?.title || interview.title;
      const department = interview.position?.department || 'Genel';
      
      if (positionTitle && !positionsMap.has(positionTitle)) {
        positionsMap.set(positionTitle, {
          id: interview._id,
          title: positionTitle,
          department,
        });
      }
    });
    
    return Array.from(positionsMap.values());
  } catch (error) {
    console.error("Error fetching available positions:", error);
    return [];
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