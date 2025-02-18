import api from "@/utils/api";

export const interviewService = {
  /**
   * Yeni mülakat oluşturma
   */
  
  async createInterview(data: {
    title: string;
    expirationDate: string | number; // ISO string veya timestamp
    stages: { personalityTest: boolean; questionnaire: boolean };
    questions?: any[];
    personalityTestId?: string;
  }) {
    const response = await api.post("/interview/create", data);
    return response.data;
  },

  /**
   * Kullanıcının mülakat listesini çekme
   */
  async getUserInterviews() {
    const response = await api.get("/interview/my");
    return response.data;
  },

  /**
   * Belirli bir mülakatı ID ile getirme
   */
  async getInterviewById(id: string) {
    const response = await api.get(`/interview/${id}`);
    return response.data;
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
