import {api }from "@/utils/api";
import { CreateInterviewDTO, Interview } from "@/types/interview";

export const interviewService = {
  /**
   * Yeni mülakat oluşturma
   */
  async createInterview(data: CreateInterviewDTO): Promise<Interview> {
    // ✅ Tarihi backend'e uygun hale getiriyoruz
    const formattedData: CreateInterviewDTO = {
      ...data,
      expirationDate: new Date(data.expirationDate).toISOString(), // ✅ ISO format
      questions: data.questions?.map(({ _id, aiMetadata, ...rest }) => ({
        ...rest,
        aiMetadata: {
          complexityLevel: aiMetadata.complexityLevel,
          requiredSkills: aiMetadata.requiredSkills,
        }, // ✅ Gereksiz alanlar çıkarıldı
      })) || [],
    };

    const response = await api.post("/interviews/create", formattedData);
    return response.data.data; // ✅ Backend `data` içinde döndürüyor
  },



  /**
   * Kullanıcının mülakat listesini çekme
   */
  async getUserInterviews(): Promise<Interview[]> {
    try {
      const response = await api.get("/interviews/my");
      return response.data.data; // ✅ Backend `data.data` içinde döndürüyor
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
      return response.data.data; // ✅ Backend'deki `data` alanına erişiyoruz.
    } catch (error: any) {
      console.error("Mülakat getirilirken hata oluştu:", error);
      throw new Error(error.response?.data?.message || "Mülakat bulunamadı.");
    }
  },

  /**
   * Mülakatı güncelleme
   */
  async updateInterview(id: string, updateData: Partial<{ 
    title: string; 
    expirationDate: string | number; 
    stages: { personalityTest: boolean; questionnaire: boolean }; 
    questions?: any[]; 
    personalityTestId?: string;
  }>) {
    const response = await api.put(`/interview/${id}`, updateData);
    return response.data;
  },

  /**
   * Mülakatı silme
   */
  async deleteInterview(id: string) {
    await api.delete(`/interview/${id}`);
  },

  /**
   * Mülakatın durumunu güncelleme (Örneğin: Draft -> Published)
   */
  async updateInterviewStatus(id: string, newStatus: "active" | "completed" | "published" | "draft" | "inactive") {
    const response = await api.put(`/interview/${id}/status`, { newStatus });
    return response.data;
  },

  /**
   * Mülakatın sorularını güncelleme
   */
  async updateInterviewQuestions(id: string, questions: any[]) {
    const response = await api.patch(`/interview/${id}/questions`, { questions });
    return response.data;
  },

  /**
   * Mülakatın kişilik testi ID’sini güncelleme
   */
  async updatePersonalityTest(id: string, personalityTestId: string) {
    const response = await api.patch(`/interview/${id}/personality-test`, { personalityTestId });
    return response.data;
  },
};
