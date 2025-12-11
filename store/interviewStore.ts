import { create } from "zustand";
import { interviewService } from "@/services/interviewService";
import {
  Interview,
  CreateInterviewDTO,
  // UpdateInterviewDTO, // Artık types/interview içinde değil, ayrı import edilmeli
  InterviewStoreState,
  InterviewStoreActions,
  InterviewStatus,
} from "@/types/interview";
// UpdateInterviewDTO'yu doğru yerden import edin (varsayımsal olarak types/updateInterviewDTO)
import { UpdateInterviewDTO } from "@/types/updateInterviewDTO";


interface InterviewStore extends InterviewStoreState, InterviewStoreActions {}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  // **State Tanımları**
  interviews: [],
  selectedInterview: null,
  loading: false,
  error: null,

  /**
   * Kullanıcının mülakat listesini API'dan çekme
   */
  fetchInterviews: async () => {
    set({ loading: true, error: null });
    try {
      const userInterviews = await interviewService.getUserInterviews();
      set({ interviews: userInterviews, loading: false });
    } catch (error: any) {
      console.error("Mülakatları çekerken hata oluştu:", error);
      set({ error: error.message || "Mülakatlar yüklenirken hata oluştu", loading: false });
    }
  },

  /**
   * Belirli bir mülakatı ID ile API'dan getirme
   */
  getInterviewById: async (id: string) => {
    set({ loading: true, error: null, selectedInterview: null }); 
    try {
      const data = await interviewService.getInterviewById(id);
      set({ selectedInterview: data, loading: false });
    } catch (error: any) {
      console.error("Mülakat getirme hatası:", error.message);
      set({ error: error.message, selectedInterview: null, loading: false });
    }
  },

/**
   * Yeni bir mülakat oluşturma
   */
 createInterview: async (data: CreateInterviewDTO): Promise<Interview> => { 
    set({ loading: true, error: null });
    try {
      const newInterview = await interviewService.createInterview(data);
      
      // **State Güncelleme**: Yeni mülakatı listenin başına ekleyelim
      set((state) => ({
        interviews: [newInterview, ...state.interviews], 
        loading: false,
      }));
      
      // ✅ YENİ: Başarıyla kaydedilen mülakatı (ID'si ile birlikte) geri döndür.
      return newInterview; 

    } catch (error: any) {
      set({ error: error.response?.data?.message || "Mülakat oluşturulurken hata oluştu", loading: false });
      // Hata durumunda Promise'i reddetmeye devam et
      throw error;
    }
  },



  /**
   * Mevcut bir mülakatı güncelleme
   */
  updateInterview: async (id: string, updateData: Partial<UpdateInterviewDTO>) => {
    set({ loading: true, error: null });
    try {
      const updatedInterview = await interviewService.updateInterview(id, updateData);
      
      // **State Güncelleme**: Yalnızca güncellenen mülakatı listede değiştir
      set((state) => ({
        interviews: state.interviews.map((i) =>
            i._id === id ? { ...i, ...updatedInterview } : i
        ),
        selectedInterview: state.selectedInterview?._id === id ? updatedInterview : state.selectedInterview,
        loading: false,
      }));

    } catch (error: any) {
      set({ error: error.response?.data?.message || "Mülakat güncellenirken hata oluştu", loading: false });
    }
  },
  
  /**
   * Mülakatı yayınlama (Publish)
   */
publishInterview: async (id: string): Promise<Interview> => {
    set({ loading: true, error: null });
    try {
      const updatedInterview = await interviewService.publishInterview(id);

      // **State Güncelleme**: 
      set((state) => ({
        interviews: state.interviews.map((i) =>
            i._id === id ? { ...i, status: updatedInterview.status } : i
        ),
        selectedInterview: state.selectedInterview?._id === id ? updatedInterview : state.selectedInterview,
        loading: false,
      }));
      
      // ✅ Başarıyla güncellenen mülakatı döndür
      return updatedInterview; 

    } catch (error: any) {
      set({ error: error.response?.data?.message || "Mülakat yayınlanırken hata oluştu", loading: false });
      throw error;
    }
  },

  /**
   * Mülakatı silme
   */
  deleteInterview: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await interviewService.deleteInterview(id);
      
      // **State Güncelleme**: Silinen mülakatı listeden filtrele
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== id),
        selectedInterview: state.selectedInterview?._id === id ? null : state.selectedInterview,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Mülakat silinirken hata oluştu", loading: false });
    }
  },
  /**
   * Mülakat linkini ve bitiş süresini güncelleme (Süre Uzatma)
   * PATCH /:id/link rotasını kullanır.
   * @returns Yeni oluşturulan linki döndürür.
   */
  updateInterviewLink: async (id: string, updateData: { expirationDate: string }): Promise<string> => {
    set({ loading: true, error: null });
    try {
      // Servis çağrısı, artık { link: string, expirationDate: string } objesi döndürüyor
      const updatedLinkInfo = await interviewService.generateInterviewLink(id, updateData.expirationDate); 
      
      const newLink = updatedLinkInfo.link;

      // **State Güncelleme**: Güncellenen link ve süre bilgisini listede yansıt
      set((state) => ({
        interviews: state.interviews.map((i) =>
            i._id === id
                ? { 
                    ...i, 
                    interviewLink: { 
                        link: newLink, 
                        expirationDate: updatedLinkInfo.expirationDate 
                    },
                    status: InterviewStatus.PUBLISHED, // Süre uzatıldığı için PUBLISHED olarak kalmalı
                } 
                : i
        ),
        loading: false,
      }));
      
      // ✅ Yeni oluşturulan linki (string) döndür (Dialog'a bildirmek için)
      return newLink;

    } catch (error: any) {
      // 📌 DÜZELTME: Hata mesajını yakalama ve kullanma
      const caughtErrorMessage = error.response?.data?.message || "Mülakat linki güncellenirken hata oluştu";
      
      set({ error: caughtErrorMessage, loading: false });
      
      // Hata durumunda Promise'i reddederek UI'da yakalanmasını sağla
      throw new Error(caughtErrorMessage); // 'errorMessage' yerine 'caughtErrorMessage' kullanıldı
    }
  },

}));

