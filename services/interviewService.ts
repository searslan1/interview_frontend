import {api }from "@/utils/api";
import { CreateInterviewDTO, Interview } from "@/types/interview";
import { UpdateInterviewDTO } from "@/types/updateInterviewDTO"; // Backend'deki DTO'lar ile uyum için eklendi

export const interviewService = {
  /**
   * Yeni mülakat oluşturma
   */
  async createInterview(data: CreateInterviewDTO): Promise<Interview> {
    // ✅ Tarihi backend'e uygun hale getiriyoruz
    const formattedData: Partial<CreateInterviewDTO> = {
      ...data,
      // Frontend'de Date objesi veya timestamp gelebilir, ISO formatına çevriliyor
      expirationDate: new Date(data.expirationDate).toISOString(), 
      // Backend'in beklediği DTO'ya uymayan alanları (örneğin _id) temizliyoruz
      questions: data.questions?.map((q) => {
        // Alt şemadaki gereksiz MongoDB ID'sini kaldırıyoruz
        const { _id, aiMetadata, ...rest } = q as any; 
        return {
          ...rest,
          aiMetadata: {
            complexityLevel: aiMetadata.complexityLevel,
            requiredSkills: aiMetadata.requiredSkills,
          }, 
        };
      }) || [],
    };

    // 🚨 Endpoint Düzeltmesi: '/interviews/create' yerine '/' kullanıldı
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
      // Hata middleware'i tarafından yakalanıp daha temiz bir mesaj gösterilmesi beklenebilir.
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
   * Mülakatı güncelleme (PUT /:id rotasına tüm güncellemeleri toplar)
   */
  async updateInterview(id: string, updateData: Partial<UpdateInterviewDTO>): Promise<Interview> {
    // Güncelleme verisinde tarih varsa, ISO formatına çevir
    const payload = { ...updateData } as any;
    if (payload.expirationDate) {
      payload.expirationDate = new Date(payload.expirationDate).toISOString();
    }
    
    // 🚨 Endpoint Düzeltmesi: '/interview/' (tekil) yerine '/interviews/' (çoğul) kullanıldı.
    const response = await api.put(`/interviews/${id}`, payload);
    return response.data.data; 
  },

  /**
   * Mülakatı yayınlama (Backend'deki PATCH /:id/publish rotasına uyar)
   */
  async publishInterview(id: string): Promise<Interview> {
    // 🚨 Yeni Metot ve Endpoint: PATCH /:id/publish
    // Backend'deki Controller/Service mantığına uyum sağlandı.
    const response = await api.patch(`/interviews/${id}/publish`);
    return response.data.data;
  },

  /**
   * Mülakatı silme (Soft Delete)
   */
  async deleteInterview(id: string) {
    // 🚨 Endpoint Düzeltmesi: '/interview/' (tekil) yerine '/interviews/' (çoğul) kullanıldı.
    // Backend'de soft delete bu rotada yapılıyor.
    await api.delete(`/interviews/${id}`);
  },
  
  /**
   * Mülakat Linkini Güncelleme (Endpoint'i koruyoruz)
   */
  async generateInterviewLink(id: string, expirationDate?: string | number): Promise<Interview> {
    const payload = { 
      expirationDate: expirationDate ? new Date(expirationDate).toISOString() : undefined
    };
    
    // 🚨 Endpoint Düzeltmesi: '/interview/' (tekil) yerine '/interviews/' (çoğul) kullanıldı.
    const response = await api.patch(`/interviews/${id}/link`, payload);
    return response.data.data; 
  },

  // 🚨 KALDIRILAN METOTLAR:
  // updateInterviewStatus: Backend'de kaldırıldı, yerine publishInterview eklendi.
  // updateInterviewQuestions: Mantığı updateInterview içine alındı.
  // updatePersonalityTest: Mantığı updateInterview içine alındı.
};
