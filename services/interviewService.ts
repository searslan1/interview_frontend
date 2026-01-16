import { api } from "@/utils/api";
import { CreateInterviewDTO, Interview } from "@/types/interview";
import { UpdateInterviewDTO } from "@/types/interview"; 

export const interviewService = {
  /**
   * Yeni mülakat oluşturma
   */
  async createInterview(data: CreateInterviewDTO): Promise<Interview> {
    // Backend DTO'suna uygun formatlama
    const formattedData = {
      // Temel alanlar
      title: data.title,
      description: data.description || "",
      expirationDate: new Date(data.expirationDate).toISOString(),
      
      // Mülakat tipi
      type: data.type || "async-video",
      
      // Pozisyon bilgileri
      position: data.position ? {
        title: data.position.title,
        department: data.position.department || "",
        description: data.position.description || "",
        competencyWeights: data.position.competencyWeights ? {
          technical: data.position.competencyWeights.technical,
          communication: data.position.competencyWeights.communication,
          problem_solving: data.position.competencyWeights.problem_solving,
        } : undefined,
      } : undefined,

      // ✅ EKLENDİ: AI Analiz Ayarları (Backend bekliyor)
      aiAnalysisSettings: data.aiAnalysisSettings ? {
        useAutomaticScoring: data.aiAnalysisSettings.useAutomaticScoring,
        gestureAnalysis: data.aiAnalysisSettings.gestureAnalysis,
        speechAnalysis: data.aiAnalysisSettings.speechAnalysis,
        eyeContactAnalysis: data.aiAnalysisSettings.eyeContactAnalysis,
        tonalAnalysis: data.aiAnalysisSettings.tonalAnalysis,
        keywordMatchScore: data.aiAnalysisSettings.keywordMatchScore,
      } : undefined,
      
      // Mevcut alanlar
      personalityTestId: (data.personalityTestId && data.personalityTestId.length > 0) 
      ? data.personalityTestId 
      : undefined,
      stages: data.stages || { personalityTest: false, questionnaire: true },
      status: data.status,
      
      // Sorular
      questions: data.questions?.map((q, index) => {
        const { _id, ...rest } = q as any;
        return {
          questionText: rest.questionText,
          expectedAnswer: rest.expectedAnswer || "",
          explanation: rest.explanation || "",
          keywords: rest.keywords || [],
          order: rest.order ?? index + 1,
          duration: rest.duration || 60,
          aiMetadata: {
            complexityLevel: rest.aiMetadata?.complexityLevel || "medium",
            requiredSkills: rest.aiMetadata?.requiredSkills || [],
          },
        };
      }) || [],
    };

    const response = await api.post("/interviews", formattedData);
    return response.data.data;
  },


  /**
   * Kullanıcının mülakat listesini çekme
   */
  async getUserInterviews(): Promise<Interview[]> {
    try {
      const response = await api.get("/interviews/my");
      return response.data.data; 
    } catch (error: any) {
      console.error("Kullanıcının mülakatlarını çekerken hata oluştu:", error);
      throw new Error("Mülakatlar yüklenemedi, lütfen tekrar deneyin.");
    }
  },

  /**
   * Belirli bir mülakatı ID ile getirme
   */
  async getInterviewById(id: string): Promise<Interview> {
    try {
      const response = await api.get(`/interviews/${id}`);
      return response.data.data; 
    } catch (error: any) {
      console.error("Mülakat getirilirken hata oluştu:", error);
      throw new Error(error.response?.data?.message || "Mülakat bulunamadı.");
    }
  },

  /**
   * Mülakatı güncelleme
   */
  async updateInterview(id: string, updateData: Partial<UpdateInterviewDTO>): Promise<Interview> {
    const payload: any = {};
    
    // Temel alanlar
    if (updateData.title !== undefined) payload.title = updateData.title;
    if (updateData.description !== undefined) payload.description = updateData.description;
    if (updateData.expirationDate) {
      payload.expirationDate = new Date(updateData.expirationDate).toISOString();
    }
    
    // Mülakat tipi
    if (updateData.type !== undefined) payload.type = updateData.type;
    
    // Pozisyon bilgileri
    if (updateData.position) {
      payload.position = {
        title: updateData.position.title,
        department: updateData.position.department || "",
        description: updateData.position.description || "",
        competencyWeights: updateData.position.competencyWeights ? {
          technical: updateData.position.competencyWeights.technical,
          communication: updateData.position.competencyWeights.communication,
          problem_solving: updateData.position.competencyWeights.problem_solving,
        } : undefined,
      };
    }

    // ✅ EKLENDİ: AI Analiz Ayarları Güncelleme
    if (updateData.aiAnalysisSettings) {
      payload.aiAnalysisSettings = {
        useAutomaticScoring: updateData.aiAnalysisSettings.useAutomaticScoring,
        gestureAnalysis: updateData.aiAnalysisSettings.gestureAnalysis,
        speechAnalysis: updateData.aiAnalysisSettings.speechAnalysis,
        eyeContactAnalysis: updateData.aiAnalysisSettings.eyeContactAnalysis,
        tonalAnalysis: updateData.aiAnalysisSettings.tonalAnalysis,
        keywordMatchScore: updateData.aiAnalysisSettings.keywordMatchScore,
      };
    }
    
    // Mevcut alanlar
    if (updateData.personalityTestId !== undefined) {
    // Boş string gelirse null gönder (ilişkiyi koparmak için) veya undefined gönder (değiştirmemek için)
    // Eğer veritabanından silmek istiyorsak null göndermeliyiz.
    payload.personalityTestId = updateData.personalityTestId === "" ? null : updateData.personalityTestId;
}   if (updateData.stages !== undefined) payload.stages = updateData.stages;
    if (updateData.status !== undefined) payload.status = updateData.status;
    
    // Sorular
    if (updateData.questions) {
      payload.questions = updateData.questions.map((q, index) => {
        const { _id, ...rest } = q as any;
        return {
          questionText: rest.questionText,
          expectedAnswer: rest.expectedAnswer || "",
          explanation: rest.explanation || "",
          keywords: rest.keywords || [],
          order: rest.order ?? index + 1,
          duration: rest.duration || 60,
          aiMetadata: {
            complexityLevel: rest.aiMetadata?.complexityLevel || "medium",
            requiredSkills: rest.aiMetadata?.requiredSkills || [],
          },
        };
      });
    }
    
    const response = await api.put(`/interviews/${id}`, payload);
    return response.data.data;
  },

  /**
   * Mülakatı yayınlama
   */
  async publishInterview(id: string): Promise<Interview> {
    const response = await api.patch(`/interviews/${id}/publish`);
    return response.data.data;
  },

  /**
   * Mülakatı silme
   */
  async deleteInterview(id: string) {
    await api.delete(`/interviews/${id}`);
  },
  
  /**
   * Mülakat Linkini Güncelleme
   */
  async generateInterviewLink(
    id: string, 
    expirationDate?: string | number
  ): Promise<{ link: string; expirationDate: string }> { 
    
    const payload = { 
      expirationDate: expirationDate ? new Date(expirationDate).toISOString() : undefined
    };
    
    const response = await api.patch(`/interviews/${id}/link`, payload);
    return response.data.data; 
  },

  /**
   * Mülakata ait başvuruları getir
   */
  async getInterviewApplications(
    interviewId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<{
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      interviewTitle: string;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = `/interviews/${interviewId}/applications${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },
};